import React, {useCallback, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '@rneui/base';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';
import {signUp} from 'aws-amplify/auth';
import AlertBox from '../../components/AlertBox';

const SignUp = ({navigation}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPW, setConfirmPW] = useState('');

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
        const {isSignUpComplete, userId, nextStep} = await signUp({
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
        console.log('userID:', userId);
        console.log('isSignUpComplete:', isSignUpComplete);
        console.log('nextStep:', nextStep);
        setIsSignUp(false);
        navigation.navigate('ConfirmAccount', {
          username: email,
          purpose: 'initialSignUp',
        });
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
      <View style={styles.profilePicAndButtonWrapper}>
        <View style={styles.profilePicPlaceholder} />
        <View style={styles.addProfilePicButton}>
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </View>
      </View>
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
});
