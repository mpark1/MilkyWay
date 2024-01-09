import React, {useCallback, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {scaleFontSize} from '../../assets/styles/scaling';
import {Button, Icon, Input} from '@rneui/base';
import {CheckBox} from '@rneui/themed';
import globalStyle from '../../assets/styles/globalStyle';
import {signIn, resendSignUpCode} from 'aws-amplify/auth';
import AlertBox from '../../components/AlertBox';
import {useDispatch} from 'react-redux';
import {
  checkAsyncStorageUserProfile,
  checkUser,
  querySingleItem,
} from '../../utils/amplifyUtil';
import {setCognitoUsername, setOwnerDetails} from '../../redux/slices/User';
import {getUser} from '../../graphql/queries';

const SignIn = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCallingUpdateAPI, setIsCallingUpdateAPI] = useState(false);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const canGoNext = email && password;

  const onSubmit = useCallback(async () => {
    if (isLoggingIn) {
      return;
    }
    try {
      setIsLoggingIn(true);
      const {isSignedIn, nextStep} = await signIn({
        username: email,
        password: password,
      });
      console.log('sign-in result: ', isSignedIn, nextStep);
      if (isSignedIn) {
        const userId = await checkUser();
        dispatch(setCognitoUsername(userId));

        let name = '';
        await querySingleItem(getUser, {id: userId}).then(response => {
          console.log("print fetched user's info: ", response.getUser);
          dispatch(
            setOwnerDetails({
              name: response.getUser.name,
              email: response.getUser.email,
            }),
          );
          name = response.getUser.name;
        });

        const updateUserInput = {
          id: userId,
          email: email,
          name: name,
          state: 'ACTIVE',
        };
        await checkAsyncStorageUserProfile(
          isCallingUpdateAPI,
          setIsCallingUpdateAPI,
          updateUserInput,
        );
      }

      // 미인증 계정 인증화면으로 보내기
      if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        AlertBox('미인증 계정입니다', '', '인증하러가기', async () => {
          await resendSignUpCode({username: email});
          navigation.navigate('ConfirmAccount', {
            username: email,
            purpose: 'reconfirm',
          });
        });
      }
    } catch (error) {
      console.log('error signing in: ', error);
      if (error.name === 'UserNotFoundException') {
        // [UserNotFoundException: User does not exist.]
        AlertBox(
          '존재하지 않는 계정입니다.',
          '회원가입을 진행해주세요.',
          '확인',
          () => {
            setEmail('');
            setPassword('');
          },
        );
      } else if (error.name === 'NotAuthorizedException') {
        // [NotAuthorizedException: Incorrect username or password.]
        AlertBox(
          '이메일 또는 비밀번호를 다시 확인해주세요.',
          '',
          '확인',
          'none',
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  }, [isLoggingIn, email, password]);

  const renderEmailField = () => {
    return (
      <Input
        onChangeText={onChangeEmail}
        value={email}
        inputContainerStyle={[styles.inputContainerStyle, {marginBottom: -10}]}
        inputStyle={styles.inputStyle}
        label="이메일*"
        labelStyle={styles.labelStyle}
        placeholder="이메일을 입력해주세요"
        placeholderTextColor={'#d9d9d9'}
        onSubmitEditing={() => passwordRef.current?.focus()}
        returnKeyType={'next'}
        keyboardType={'email-address'}
      />
    );
  };

  const renderPasswordField = () => {
    return (
      <Input
        onChangeText={onChangePassword}
        value={password}
        ref={passwordRef}
        inputContainerStyle={[styles.inputContainerStyle, {marginBottom: -23}]}
        inputStyle={styles.inputStyle}
        label="비밀번호*"
        labelStyle={styles.labelStyle}
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor={'#d9d9d9'}
        keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
        secureTextEntry={true}
      />
    );
  };

  const [checked, setChecked] = useState(true);
  const toggleCheckbox = () => setChecked(!checked);

  const renderAutoLogin = () => {
    return (
      <CheckBox
        title={'자동 로그인'}
        wrapperStyle={{marginLeft: -15}}
        textStyle={styles.checkBox.text}
        checked={checked}
        onPress={toggleCheckbox}
        iconType="material-community"
        checkedIcon={
          <Icon
            name="checkbox-outline"
            type="material-community"
            color="#6395E1"
            size={25}
            iconStyle={{marginRight: -3}}
          />
        }
        uncheckedIcon={
          <Icon
            name="checkbox-blank-outline"
            type="material-community"
            color="#939393"
            size={25}
            iconStyle={{marginRight: -3}}
          />
        }
      />
    );
  };

  const renderButtons = () => {
    return (
      <>
        <Button
          title={'로그인'}
          titleStyle={styles.loginButton.title}
          containerStyle={styles.loginButton.container}
          buttonStyle={globalStyle.backgroundBlue}
          disabled={!canGoNext}
          onPress={() => onSubmit()}
        />
        <Button
          title={'회원가입'}
          titleStyle={styles.signUpButton.title}
          type={'outline'}
          buttonStyle={styles.signUpButton.button}
          containerStyle={styles.signUpButton.container}
          onPress={() => navigation.navigate('SignUp')}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Text style={styles.appName}>은하수</Text>
      <View style={styles.spacer}>
        {renderEmailField()}
        {renderPasswordField()}
        {renderAutoLogin()}
        {renderButtons()}
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.findPassWordText}>비밀번호 찾기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  appName: {
    alignSelf: 'center',
    fontSize: scaleFontSize(24),
    fontWeight: '700',
    color: '#374957',
    paddingVertical: Dimensions.get('window').height * 0.05,
  },
  spacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.05,
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
  },
  inputStyle: {
    fontSize: scaleFontSize(16),
    color: '#000',
    marginLeft: 10,
  },
  labelStyle: {
    fontSize: scaleFontSize(16),
    color: '#000',
    fontWeight: '400',
    marginBottom: 10,
  },
  buttonContainerStyle: {
    width: Dimensions.get('window').width * 0.7,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 25,
  },
  checkBox: {
    text: {
      fontSize: scaleFontSize(16),
      fontWeight: '400',
      color: '#374957',
    },
  },
  loginButton: {
    container: {
      width: Dimensions.get('window').width * 0.85,
      marginTop: 10,
      alignSelf: 'center',
      borderRadius: 25,
    },
    title: {
      fontWeight: 'bold',
      fontSize: scaleFontSize(20),
    },
  },
  signUpButton: {
    container: {
      width: Dimensions.get('window').width * 0.85,
      marginVertical: 10,
      alignSelf: 'center',
    },
    button: {
      borderColor: '#6395E1',
      borderRadius: 25,
    },
    title: {
      fontWeight: 'bold',
      fontSize: scaleFontSize(20),
      color: '#6395E1',
    },
  },
  findPassWordText: {
    fontSize: scaleFontSize(16),
    color: '#939393',
    alignSelf: 'center',
  },
});
