import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
} from 'react-native';
import {signUp} from 'aws-amplify/auth';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {Button} from '@rneui/base';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import AlertBox from '../../components/AlertBox';
import {useDispatch} from 'react-redux';
import {setOwnerDetails} from '../../redux/slices/User';
import Backdrop from '../../components/Backdrop';
import {profilePicOption} from '../../constants/imagePickerOptions';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const SignUp = ({navigation}) => {
  const dispatch = useDispatch();

  const [profilePic, setProfilePic] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPW, setConfirmPW] = useState('');

  const snapPoints = useMemo(() => ['53%'], []);
  const bottomSheetModalRef = useRef(null);

  const canGoNext = name && email && password && confirmPW;

  const onChangeName = useCallback(text => {
    const trimmedText = text.trim();
    setName(trimmedText);
  }, []);

  const onChangeEmail = useCallback(text => {
    const trimmedText = text.trim();
    setEmail(trimmedText);
  }, []);

  const pwRef = useRef(null);
  const confirmPWRef = useRef(null);

  const onChangePW = useCallback(text => {
    const trimmedText = text.trim();
    setPassword(trimmedText);
  }, []);

  const onChangeConfirmPW = useCallback(text => {
    const trimmedText = text.trim();
    setConfirmPW(trimmedText);
  }, []);

  const onResponseFromImagePicker = async res => {
    bottomSheetModalRef.current?.close();
    if (res.didCancel || !res) {
      return;
    }
    setProfilePic(res.path);
  };

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
        {profilePic ? (
          <View style={styles.profilePicPlaceholder}>
            <Image style={styles.profilePic} source={{uri: profilePic}} />
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
      <View
        style={{
          marginBottom: Dimensions.get('window').height * 0.02,
        }}>
        <TextInput
          style={styles.textInput}
          placeholder={'*이름 또는 닉네임을 입력해주세요'}
          placeholderTextColor={'#939393'}
          autoCorrect={false}
          autoCapitalize={'none'}
          value={name}
          onChangeText={onChangeName}
          blurOnSubmit={true}
          clearButtonMode={'while-editing'}
        />
      </View>
    );
  };

  const renderEmailField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.02}}>
        <TextInput
          style={styles.textInput}
          placeholder={'*이메일을 입력해주세요'}
          placeholderTextColor={'#939393'}
          autoCorrect={false}
          autoCapitalize={'none'}
          value={email}
          onChangeText={onChangeEmail}
          textContentType={'emailAddress'}
          keyboardType={'email-address'}
          blurOnSubmit={true}
          clearButtonMode={'while-editing'}
        />
      </View>
    );
  };

  const renderPasswordField = () => {
    return (
      <View>
        <TextInput
          style={[
            styles.textInput,
            {
              borderBottomWidth: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
          placeholder={'*비밀번호를 입력해주세요.'}
          placeholderTextColor={'#939393'}
          clearButtonMode={'while-editing'}
          onChangeText={onChangePW}
          onSubmitEditing={() => confirmPWRef.current?.focus()}
          autoCorrect={false}
          autoCapitalize={'none'}
          ref={pwRef}
          returnKeyType={'next'}
          secureTextEntry={true}
          textContentType={'newPassword'}
          value={password}
        />
        <TextInput
          style={[
            styles.textInput,
            {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            },
          ]}
          placeholder={'*비밀번호를 한번 더 입력해주세요'}
          placeholderTextColor={'#939393'}
          returnKeyType={'next'}
          secureTextEntry={true}
          textContentType={'password'}
          onChangeText={onChangeConfirmPW}
          ref={confirmPWRef}
          value={confirmPW}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
      </View>
    );
  };

  async function signUpButton() {
    // 1. check email validation
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      setEmail('');
      return AlertBox('유효한 이메일이 아닙니다.', '', '확인', 'none');
    }
    // 2. check password and confirm password (check for mismatch)
    if (confirmPW !== password) {
      setPassword('');
      setConfirmPW('');
      return AlertBox('비밀번호가 일치하지 않습니다.', '', '확인', 'none');
    }
    // 3. amplfiy 회원가입 api
    if (!isSignUp) {
      setIsSignUp(true);
      try {
        const {userId} = await signUp({
          username: email,
          password: password,
          options: {
            userAttributes: {
              name,
            },
            // optional
            autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
          },
        });
        console.log('1. print if signup is complete: ', userId);
        // after a user successfully signs up (before confirmation), save user's information in redux
        if (userId) {
          dispatch(
            setOwnerDetails({
              name: name,
              email: email,
              profilePic: profilePic,
            }),
          );
          console.log('2. user dispatch is complete.');
          // 프로파일 사진 있으면 File System 에 사진 복사 & AsyncStorage 에 파일 path 저장
          console.log('length of profile pic: ', profilePic.length);
          if (profilePic.length > 0) {
            let navigationReady = false;
            const resFromResizer = await ImageResizer.createResizedImage(
              profilePic, // path
              200, // width
              200, // height
              'JPEG', // format
              100, // quality
            );
            const imagePath = `${RNFS.DocumentDirectoryPath}/userProfile100.jpeg`;
            console.log(
              'print image path before saving into file system: ',
              imagePath,
            );
            // copy photo to file system
            await RNFS.copyFile(resFromResizer.uri, imagePath).then(
              async () => {
                await AsyncStorage.setItem('userProfile100', imagePath);
                console.log('print if FS copyFile is successful. ', imagePath);
                navigationReady = true;
              },
            );
            setIsSignUp(false);
            if (navigationReady) {
              navigation.navigate('ConfirmAccount', {
                username: email,
                purpose: 'initialSignUp',
              });
            }
          }
          setIsSignUp(false);
          navigation.navigate('ConfirmAccount', {
            username: email,
            purpose: 'initialSignUp',
          });
        }
      } catch (error) {
        console.log('error signing up:', error.name);
        setIsSignUp(false);
        if (error.name === 'UsernameExistsException') {
          return AlertBox('이미 존재하는 이메일입니다.', '', '확인', () =>
            navigation.navigate('SignIn'),
          );
        } else if (error.name === 'InvalidPasswordException') {
          // Username should be an email.
          return AlertBox(
            '비밀번호 오류',
            '비밀번호에 영문 대문자, 소문자, 숫자를 8자 이내로 입력해주세요.',
            '확인',
            'none',
          );
        }
      }
    }
  }

  const renderSignUpButton = () => {
    return (
      <Button
        disabled={!canGoNext}
        title={'회원가입'}
        titleStyle={styles.signUpButton.titleStyle}
        type={'outline'}
        buttonStyle={styles.signUpButton.buttonStyle}
        containerStyle={styles.signUpButton.containerStyle}
        onPress={() => signUpButton()}
      />
    );
  };

  return (
    <View style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      {renderProfilePicField()}
      <View style={styles.inputFieldsContainer}>
        {renderNameField()}
        {renderEmailField()}
        {renderPasswordField()}
      </View>
      <View style={styles.required.container}>
        <Text style={styles.required.text}>
          영문 대문자,소문자,숫자 포함 8자 이상 입력해주세요.
        </Text>
      </View>
      {renderSignUpButton()}
      {renderBottomSheetModal()}
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  profilePicAndButtonWrapper: {
    width: 115,
    height: 115,
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.04,
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 115 / 2,
  },
  profilePicPlaceholder: {
    width: 115,
    height: 115,
    borderRadius: 115 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },

  addProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 0,
  },

  inputFieldsContainer: {
    width: '100%',
    paddingHorizontal: Dimensions.get('window').width * 0.1,
    paddingTop: Dimensions.get('window').height * 0.03,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    fontSize: scaleFontSize(16),
  },
  required: {
    container: {
      width: '100%',
      paddingHorizontal: Dimensions.get('window').width * 0.1,
      paddingVertical: Dimensions.get('window').height * 0.01,
    },
    text: {
      marginLeft: 5,
      fontSize: scaleFontSize(13),
      color: '#374957',
    },
  },
  signUpButton: {
    titleStyle: {
      fontWeight: 'bold',
      fontSize: scaleFontSize(20),
      color: '#6395E1',
    },
    buttonStyle: {
      borderColor: '#6395E1',
      borderRadius: 25,
    },
    containerStyle: {
      width: '100%',
      paddingHorizontal: Dimensions.get('window').width * 0.1,
      marginVertical: 30,
      alignSelf: 'center',
    },
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
});
