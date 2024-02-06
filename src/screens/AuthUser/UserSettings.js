import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '@rneui/base';
import {deleteUser} from 'aws-amplify/auth';
import {updateUser} from '../../graphql/mutations';
import {
  setCognitoUserToNull,
  setUserName,
  setUserProfilePic,
  setUserProfilePicS3Key,
  signoutUser,
} from '../../redux/slices/User';
import {
  checkS3Url,
  movePetToInactiveTable,
  mutationItem,
  mutationItemNoAlertBox,
  retrieveS3Url,
  updateProfilePic,
} from '../../utils/amplifyUtil';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';
import AlertBox from '../../components/AlertBox';
import SinglePictureBottomSheetModal from '../../components/SinglePictureBottomSheetModal';

const UserSettings = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    cognitoUsername,
    name,
    email,
    profilePic, // url
    profilePicS3Key,
    s3UrlExpiredAt,
  } = useSelector(state => state.user);
  const pet = useSelector(state => state.pet);

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

  const handleDeleteUser = async () => {
    try {
      // 1. update user's status to INACTIVE in User table in db.
      const userInput = {
        id: cognitoUsername,
        email: email,
        profilePic: profilePic,
        name: name,
        state: 'INACTIVE',
      };
      const res = await mutationItemNoAlertBox(
        isCallingUpdateAPI,
        setIsCallingUpdateAPI,
        userInput,
        updateUser,
      );

      // 가족에게 매니저 위임하도록 연락

      // 2. move current pet over to inactive pet table if the user is the manager
      const createInactivePetInputVariables = {
        id: pet.id,
        name: pet.name,
        profilePic: pet.profilePicS3Key,
        lastWord: pet.lastWord,
        birthday: pet.birthday,
        deathDay: pet.deathday,
        petType: pet.petType,
        managerID: pet.userID,
        identityId: pet.identityId,
        deathCause: pet.deathCause,
      };
      // 가족 1명뿐이면 &&
      //   (await movePetToInactiveTable(createInactivePetInputVariables, pet.id));

      // 3. delete user from cognito userpool
      if (res) {
        await deleteUser();
      }
      console.log('2. Deleted user in cognito');
      dispatch(signoutUser());
      dispatch(setCognitoUserToNull());
      console.log('3. updated redux to make user null');
    } catch (error) {
      console.log('계정삭제에 에러가 발생했습니다.');
      AlertBox(
        '계정삭제 도중에 에러가 발생했습니다. 관리자에게 연락해주세요.',
        '',
        '확인',
        'none',
      );
    }
  };

  const renderDeleteAccountButton = () => {
    return (
      <Pressable
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

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {profilePic.length !== 0 && renderProfilePicField()}
        <View style={styles.fieldsContainer}>
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
    marginTop: Dimensions.get('window').height * 0.05,
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
});
