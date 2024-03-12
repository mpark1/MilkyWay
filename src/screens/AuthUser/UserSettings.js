import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '@rneui/base';
import {deleteUser} from 'aws-amplify/auth';
import {deletePetFamily, updateUser} from '../../graphql/mutations';
import {
  setCognitoUserToNull,
  setUserName,
  setUserProfilePic,
  signoutUser,
} from '../../redux/slices/User';
import {
  checkS3Url,
  hasOneFamilyMember,
  movePetToInactiveTable,
  mutationItem,
  querySingleItem,
  retrieveS3Url,
  updateProfilePic,
} from '../../utils/amplifyUtil';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';
import AlertBox from '../../components/AlertBox';
import SinglePictureBottomSheetModal from '../../components/SinglePictureBottomSheetModal';
import {
  getPet,
  getPsychologicalTest,
  getServiceSurvey,
} from '../../graphql/queries';
import {generateClient} from 'aws-amplify/api';

const UserSettings = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    cognitoUsername,
    name,
    email,
    profilePic, // url
    profilePicS3Key,
    s3UrlExpiredAt,
    myPets,
  } = useSelector(state => state.user);

  const [newProfilePicPath, setNewProfilePicPath] = useState(''); // local path from camera/gallery
  const [newProfilePicUrl, setNewProfilePicUrl] = useState(profilePic); // url - could be empty string
  const [userName, setName] = useState(name);
  const [isCallingUpdateAPI, setIsCallingUpdateAPI] = useState(false);
  const bottomSheetModalRef = useRef(null);

  const noUpdateInUserInfo = userName === name;
  const noUpdateInUserProfilePic = newProfilePicUrl === profilePic;
  const canGoNext =
    !(noUpdateInUserInfo && noUpdateInUserProfilePic) && !isCallingUpdateAPI;

  useEffect(() => {
    profilePic.length !== 0 && checkS3urlFunc();
  }, [profilePic]);

  const checkS3urlFunc = async () => {
    const newProfileUrl = await checkS3Url(s3UrlExpiredAt, profilePicS3Key);
    if (newProfileUrl.profilePic !== null) {
      dispatch(setUserProfilePic(newProfileUrl));
    }
  };

  const onChangeName = useCallback(text => {
    const trimmedText = text.trim();
    setName(trimmedText);
  }, []);

  function popPage() {
    navigation.pop();
  }

  const onUpdateUserInfo = async () => {
    // 1. update profile picture in s3 if changed
    let s3key = '';
    try {
      if (
        // 1-1. 기존에 사진이 없다가 사진을 선택한 경우
        (profilePic.length === 0 && newProfilePicPath.length > 0) ||
        // 1-2. 기존에 사진이 있다가 새로운 사진으로 변경하는 경우
        (profilePic.length !== 0 && newProfilePicPath !== profilePic)
      ) {
        s3key = await updateProfilePic(newProfilePicPath, 'user', profilePic);
        await retrieveS3Url('userProfile/' + s3key).then(res => {
          dispatch(
            setUserProfilePic({
              profilePic: res.url.href,
              s3UrlExpiredAt: res.expiresAt.toString(),
            }),
          );
        });
      }
      // 2. update username in redux if it has been changed
      name !== userName && dispatch(setUserName(name));
      // 3. update in db
      if (newProfilePicPath !== profilePic || name !== userName) {
        const newUserInput = {
          id: cognitoUsername,
          profilePic:
            s3key.length > 0 ? 'userProfile/' + s3key : profilePicS3Key,
          name: name,
          state: 'ACTIVE',
        };
        await mutationItem(
          isCallingUpdateAPI,
          setIsCallingUpdateAPI,
          newUserInput,
          updateUser,
          '정보가 성공적으로 변경되었습니다.',
          popPage,
        );
      }
    } catch (error) {
      console.log('Error in onUpdateUserInfo: ', error);
    }
  };

  const resetReduxUponDelete = () => {
    dispatch(signoutUser());
    dispatch(setCognitoUserToNull());
    console.log('4. updated redux to make user null');
  };

  const handleDeleteUser = async () => {
    setIsCallingUpdateAPI(true);
    let readyToDeleteUserFromCognito = false;
    try {
      // 1. update user's status to INACTIVE in User table in db.
      const userInput = {
        id: cognitoUsername,
        email: email,
        profilePic: profilePic,
        name: name,
        state: 'INACTIVE',
      };
      const client = generateClient();
      await client.graphql({
        query: updateUser,
        variables: {input: userInput},
        authMode: 'userPool',
      });
      console.log('1. Updated User state to inactive');
      AlertBox('탈퇴가 완료되었습니다.', '', '확인', resetReduxUponDelete);

      // 2-1. For each pet is myPets array, delete from petFamily table
      // 2-2. check if there's exactly one family member associated with it
      // If so, move the pet to Inactive table
      await Promise.all(
        myPets.map(async petId => {
          // check if the user's pet has only 1 family member (user)
          const hasOnlyOneFamilyMember = await hasOneFamilyMember(petId);
          // delete pet and user's association from the petFamily table
          await client.graphql({
            query: deletePetFamily,
            variables: {input: {familyMemberID: cognitoUsername, petID: petId}},
            authMode: 'userPool',
          });
          // if the user is the only family member of the pet, delete pet from the Pet table
          // move the pet item to InactivePet table (movePetToInactiveTable)
          if (hasOnlyOneFamilyMember) {
            const petDetails = await client.graphql({
              query: getPet,
              variables: {
                id: petId,
              },
              authMode: 'userPool',
            });
            const selectedPet = petDetails.data.getPet;
            const newInactivePet = {
              id: selectedPet.id,
              profilePic: selectedPet.profilePic,
              name: selectedPet.name,
              birthday: selectedPet.birthday,
              deathDay: selectedPet.deathDay,
              lastWord: selectedPet.lastWord,
              deathCause: selectedPet.deathCause,
              identityId: selectedPet.identityId,
              petType: selectedPet.petType,
              managerID: selectedPet.managerID,
            };
            await movePetToInactiveTable(newInactivePet, petId);
          }
          // 2명 이상의 가족이 있으면 가족에게 매니저 위임하도록 하는 장치 필요
        }),
      );
      readyToDeleteUserFromCognito = true;
      console.log('2. Created InactivePet(s) with only one family member');

      // 4. delete user from cognito userpool
      if (readyToDeleteUserFromCognito) {
        await deleteUser();
        console.log('3. Deleted user in cognito');
      }
    } catch (error) {
      console.log('계정삭제에 에러가 발생했습니다.');
      AlertBox(
        '계정삭제 도중에 에러가 발생했습니다. 관리자에게 연락해주세요.',
        '',
        '확인',
        'none',
      );
    } finally {
      setIsCallingUpdateAPI(false);
    }
  };

  const renderProfilePicField = () => {
    return (
      <View style={styles.profilePicAndButtonWrapper}>
        <View style={styles.profilePicPlaceholder}>
          {newProfilePicUrl.length !== 0 ? (
            <Image
              style={styles.profilePic}
              source={{uri: newProfilePicUrl}}
              resizeMode={'cover'}
            />
          ) : (
            <Image
              style={styles.profilePic}
              source={require('../../assets/images/default_user_profilePic.jpg')}
              resizeMode={'cover'}
            />
          )}
        </View>
        <Pressable
          onPress={() => bottomSheetModalRef.current?.present()}
          style={styles.addProfilePicButton}>
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  };

  const renderNameField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.textInput}
            placeholder={userName}
            placeholderTextColor={'#000'}
            autoCorrect={false}
            blurOnSubmit={true}
            onChangeText={onChangeName}
            value={userName}
            maxLength={10}
          />
        </View>
      </View>
    );
  };

  const renderEmailField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.textInput}
            placeholder={email}
            placeholderTextColor={'#939393'}
            editable={false}
          />
        </View>
      </View>
    );
  };

  const renderSubmitButton = () => {
    return (
      <View style={styles.blueButton}>
        <Button
          title={'완료'}
          disabled={!canGoNext}
          titleStyle={styles.submitButton.titleStyle}
          containerStyle={styles.submitButton.containerStyle}
          buttonStyle={globalStyle.backgroundBlue}
          onPress={onUpdateUserInfo}
        />
      </View>
    );
  };

  const renderChangePWButton = () => {
    return (
      <Pressable
        style={styles.changePWButton.container}
        onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.changePWButton.title}>비밀번호 변경하기</Text>
      </Pressable>
    );
  };

  const renderDeleteAccountButton = () => {
    return (
      <Pressable
        disabled={isCallingUpdateAPI}
        style={styles.changePWButton.container}
        onPress={() =>
          AlertBox(
            '회원탈퇴',
            '회원탈퇴에 동의할 경우 회원님의 정보는 복구가 불가능합니다. 탈퇴를 계속 진행 하시겠습니까?',
            '탈퇴동의',
            handleDeleteUser,
          )
        }>
        <Text style={[styles.changePWButton.title, {color: '#939393'}]}>
          회원탈퇴
        </Text>
      </Pressable>
    );
  };

  const renderPsychTestResult = () => {
    const onSubmit = async () => {
      await querySingleItem(getPsychologicalTest, {id: cognitoUsername}).then(
        data => {
          const obj = data.getPsychologicalTest;
          console.log('print single obj', obj);
          if (obj !== null) {
            navigation.navigate('TestResult', {
              totalScore: obj.totalScore,
              griefScore: obj.griefScore,
              angerScore: obj.angerScore,
              guiltScore: obj.guiltScore,
              whichPage: 'UserSettings',
            });
          } else {
            Alert.alert('아직 심리상담을 받지 않으셨네요', '', [
              {
                text: '심리상담 받으러 가기',
                onPress: () => navigation.navigate('커뮤니티'), // Pass the callback function here
              },
            ]);
          }
        },
      );
    };

    return (
      <Pressable style={styles.psychTest} onPress={onSubmit}>
        <Text style={styles.psychTestText}>심리테스트 결과보기</Text>
        <AntDesign
          name={'arrowright'}
          size={scaleFontSize(20)}
          color={'#6395E1'}
        />
      </Pressable>
    );
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderProfilePicField()}
        <View style={styles.fieldsContainer}>
          {renderPsychTestResult()}
          {renderNameField()}
          {renderEmailField()}
          <SinglePictureBottomSheetModal
            type={'updateUser'}
            bottomSheetModalRef={bottomSheetModalRef}
            setPicture={setNewProfilePicPath}
            setPictureUrl={setNewProfilePicUrl}
          />
        </View>
        {renderSubmitButton()}
        {renderChangePWButton()}
        {renderDeleteAccountButton()}
      </View>
    </View>
  );
};

export default UserSettings;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: 20,
    paddingVertical: Dimensions.get('window').height * 0.04,
  },
  profilePicAndButtonWrapper: {
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  containerForInput: {
    marginBottom: Dimensions.get('window').height * 0.025,
  },
  profilePicPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  profilePic: {width: '100%', height: '100%', borderRadius: 130 / 2},
  addProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  fieldsContainer: {
    width: '90%',
    marginTop: 15,
    marginBottom: Dimensions.get('window').height * 0.1,
    alignSelf: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 10,
    color: '#000',
  },
  textInput: {
    color: '#000',
    borderColor: '#939393',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: Dimensions.get('window').width * 0.6,
    borderRadius: 5,
    padding: 7,
    fontSize: scaleFontSize(18),
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  bottomSheet: {
    inner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    icons: {
      width: 80,
      height: 80,
      alignItems: 'center',
    },
  },
  hideBottomSheetHandle: {
    height: 0,
  },
  blueButton: {
    alignSelf: 'center',
  },
  submitButton: {
    titleStyle: {
      fontSize: scaleFontSize(18),
      color: '#FFF',
      fontWeight: '700',
      paddingVertical: 5,
      paddingHorizontal: 25,
    },
    containerStyle: {
      borderRadius: 10,
    },
  },
  changePWButton: {
    container: {
      alignSelf: 'center',
    },
    title: {
      paddingTop: Dimensions.get('window').height * 0.015,
      fontSize: scaleFontSize(18),
      color: '#6395E1',
    },
  },
  psychTest: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  psychTestText: {
    fontSize: scaleFontSize(18),
    color: '#6395E1',
    paddingRight: 5,
  },
});
