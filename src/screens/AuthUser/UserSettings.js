import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Button} from '@rneui/base';
import {deleteUser, signOut} from 'aws-amplify/auth';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import Backdrop from '../../components/Backdrop';
import AlertBox from '../../components/AlertBox';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import {profilePicOption} from '../../constants/imagePickerOptions';

import {
  getIdentityID,
  mutationItem,
  mutationItemNoAlertBox,
  retrieveS3Url,
  updateProfilePic,
} from '../../utils/amplifyUtil';
import {updateUser} from '../../graphql/mutations';

import {useDispatch, useSelector} from 'react-redux';
import {
  setCognitoUserToNull,
  updateUserNameOrPic,
} from '../../redux/slices/User';

const UserSettings = ({navigation}) => {
  const dispatch = useDispatch();
  const {cognitoUsername, name, email, profilePic} = useSelector(
    state => state.user,
  );
  const [newProfilePicPath, setNewProfilePicPath] = useState('');
  const [userProfilePicUrl, setProfilePicUrl] = useState('');
  const [userName, setName] = useState(name);

  const [isCallingUpdateAPI, setIsCallingUpdateAPI] = useState(false);

  const snapPoints = useMemo(() => ['30%'], []);
  const bottomSheetModalRef = useRef(null);

  useEffect(() => {
    // console.log('print s3key in redux inside user settings.js: ', profilePic);
    //get user's profile picture from S3
    retrieveS3Url(profilePic).then(res => {
      setProfilePicUrl(res.url.href);
      console.log('s3 presigned url in settings.js: ', res.url.href);
    });
  }, []);

  const onChangeName = useCallback(text => {
    const trimmedText = text.trim();
    setName(trimmedText);
  }, []);

  function popPage() {
    // update redux
    dispatch(
      updateUserNameOrPic({
        name: name,
        profilePic: profilePic,
      }),
    );
    navigation.pop();
  }

  const onUpdateUserInfo = async () => {
    const s3key = await updateProfilePic(newProfilePicPath, 'user', profilePic);

    const newUserInput = {
      id: cognitoUsername,
      profilePic: 'userProfile/' + s3key,
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
  };

  const onResponseFromImagePicker = useCallback(async res => {
    bottomSheetModalRef.current?.close();
    if (res.didCancel || !res) {
      return;
    }
    setNewProfilePicPath(res.path); // selected picture's uri
    setProfilePicUrl(res.path);
  }, []);

  const onLaunchCamera = () => {
    ImagePicker.openCamera(profilePicOption)
      .then(onResponseFromImagePicker)
      .catch(err => console.log(err.message));
  };

  const onLaunchGallery = async () => {
    ImagePicker.openPicker(profilePicOption)
      .then(onResponseFromImagePicker)
      .catch(err => console.log('Error: ', err.message));
  };

  const renderProfilePicField = () => {
    return (
      <View style={styles.profilePicAndButtonWrapper}>
        {userProfilePicUrl.length !== 0 ? (
          <View style={styles.profilePicPlaceholder}>
            <Image
              style={styles.profilePic}
              source={{uri: userProfilePicUrl}}
            />
          </View>
        ) : (
          <View style={styles.profilePicPlaceholder} />
        )}
        <Pressable
          onPress={() => bottomSheetModalRef.current?.present()}
          style={styles.addProfilePicButton}>
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  };

  const renderBackdrop = useCallback(
    props => <Backdrop {...props} opacity={0.2} pressBehavior={'close'} />,
    [],
  );

  const renderBottomSheetModalInner = useCallback(() => {
    return (
      <View style={styles.bottomSheet.inner}>
        <Pressable
          style={styles.bottomSheet.icons}
          onPress={() => onLaunchCamera()}>
          <Entypo name={'camera'} size={50} color={'#374957'} />
          <Text style={{color: '#000'}}>카메라</Text>
        </Pressable>
        <Pressable
          style={styles.bottomSheet.icons}
          onPress={() => onLaunchGallery()}>
          <FontAwesome name={'picture-o'} size={50} color={'#374957'} />
          <Text style={{color: '#000'}}>갤러리</Text>
        </Pressable>
      </View>
    );
  }, []);

  const renderBottomSheetModal = useCallback(() => {
    return (
      <BottomSheetModal
        handleIndicatorStyle={styles.hideBottomSheetHandle}
        handleStyle={styles.hideBottomSheetHandle}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        children={renderBottomSheetModalInner()}
      />
    );
  }, []);

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
          title={'확인'}
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
      console.log(
        '1. updated db to update user to INACTIVE',
        res.data.updateUser.state,
      );
      // 2. delete user from cognito userpool
      if (res) {
        await deleteUser();
      }
      console.log('2. Deleted user in cognito');
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
        {renderProfilePicField()}
        <View style={styles.fieldsContainer}>
          {renderNameField()}
          {renderEmailField()}
          {renderBottomSheetModal()}
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
