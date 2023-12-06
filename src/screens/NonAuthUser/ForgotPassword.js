import React, {useCallback, useState} from 'react';
import {View, Alert, StyleSheet, Dimensions, TextInput} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import {Button, Input} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';
import {resetPassword, confirmResetPassword} from 'aws-amplify/auth';
import AlertBox from '../../components/AlertBox';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPW, setNewPW] = useState('');
  const [confirmNewPW, setConfirmNewPW] = useState('');
  const [step, setStep] = useState('beforeConfirmation');

  const [isSendingConfirmationCode, setIsSendingConfirmationCode] =
    useState(false);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);

  const onChangeCode = useCallback(text => {
    setCode(text.trim());
  }, []);

  const onChangeNewPW = useCallback(text => {
    setNewPW(text.trim());
  }, []);

  const onChangeConfirmNewPW = useCallback(text => {
    setConfirmNewPW(text.trim());
  }, []);

  const onSubmit = async () => {
    if (!isSendingConfirmationCode) {
      setIsSendingConfirmationCode(true);
      try {
        const output = await resetPassword({username: email});
        setStep('afterConfirmation');
        handleResetPasswordNextSteps(output);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSendingConfirmationCode(false);
      }
    }
  };

  function handleResetPasswordNextSteps(output) {
    const {nextStep} = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`,
        );
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        break;
    }
  }

  async function handleConfirmResetPassword() {
    if (confirmNewPW !== newPW) {
      setNewPW('');
      setConfirmNewPW('');
      return AlertBox('비밀번호가 일치하지 않습니다.', '', '확인', 'none');
    }
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPW,
      });
      AlertBox('비밀번호 변경 성공!', '', '로그인하러 가기', () =>
        navigation.navigate('SignIn'),
      );
    } catch (error) {
      console.log('confirm reset password error: ', error);
      if (error.name === 'CodeMismatchException') {
        AlertBox(
          '인증번호가 일치하지 않습니다',
          '인증번호를 다시 확인해주세요',
          '확인',
          'none',
        );
      } else if (error.name === 'LimitExceededException') {
        AlertBox(
          '인증번호 오류 횟수를 초과하였습니다.',
          '잠시후(정확히 몇분?) 다시 시도해주세요.',
          '확인',
          'none',
        );
      } else if (error.name === 'InvalidPasswordException') {
        // Username should be an email.
        setNewPW('');
        setConfirmNewPW('');
        return AlertBox(
          '비밀번호 오류',
          '비밀번호에 영문 대문자, 소문자, 숫자를 8자 이내로 입력해주세요.',
          '확인',
          'none',
        );
      }
    }
  }

  const renderEmailField = () => {
    return (
      <Input
        onChangeText={onChangeEmail}
        value={email}
        inputContainerStyle={styles.email.inputContainerStyle}
        inputStyle={styles.email.inputStyle}
        label="가입한 이메일을 입력해주세요"
        labelStyle={styles.email.labelStyle}
        placeholder="이메일을 입력해주세요"
        placeholderTextColor={'#d9d9d9'}
        returnKeyType={'send'}
        keyboardType={'email-address'}
      />
    );
  };

  const renderGoNextButton = () => {
    return (
      <Button
        title={'확인'}
        titleStyle={styles.button.titleStyle}
        containerStyle={styles.button.containerStyle}
        buttonStyle={globalStyle.backgroundBlue}
        disabled={!email}
        onPress={() => onSubmit()}
      />
    );
  };

  const renderConfirmationCodeField = () => {
    return (
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeCode}
          label={'인증번호*'}
          placeholder={'인증번호를 입력해주세요'}
          value={code}
          keyboardType={'number-pad'}
          returnKeyType={'send'}
          placeholderTextColor={'#939393'}
        />
      </View>
    );
  };

  const renderNewPWField = () => {
    return (
      <View>
        <TextInput
          style={[
            styles.textInput,
            {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
          placeholder={'*새로운 비밀번호를 설정해주세요.'}
          placeholderTextColor={'#939393'}
          clearButtonMode={'while-editing'}
          onChangeText={onChangeNewPW}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          secureTextEntry={true}
          textContentType={'newPassword'}
          value={newPW}
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
          onChangeText={onChangeConfirmNewPW}
          value={confirmNewPW}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
      </View>
    );
  };

  const renderConfirmResetPWButton = () => {
    return (
      <Button
        title={'비밀번호 설정'}
        titleStyle={styles.button.titleStyle}
        containerStyle={styles.button.containerStyle}
        buttonStyle={globalStyle.backgroundBlue}
        disabled={!(code && newPW && confirmNewPW)}
        onPress={() => handleConfirmResetPassword()}
      />
    );
  };

  const afterConfirmation = () => {
    return (
      <View>
        {renderConfirmationCodeField()}
        {renderNewPWField()}
        {renderConfirmResetPWButton()}
      </View>
    );
  };

  return (
    <View style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.spacer}>
        {step === 'beforeConfirmation' && renderEmailField()}
        {step === 'beforeConfirmation' && renderGoNextButton()}
        {step !== 'beforeConfirmation' && afterConfirmation()}
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  spacer: {
    paddingTop: Dimensions.get('window').height * 0.03,
    paddingHorizontal: Dimensions.get('window').width * 0.05,
  },
  email: {
    inputContainerStyle: {
      borderWidth: 1,
      borderColor: '#D9D9D9',
      borderRadius: 5,
      marginBottom: -15,
    },
    inputStyle: {
      fontSize: scaleFontSize(16),
      color: '#000',
      paddingHorizontal: 10,
    },
    labelStyle: {
      fontSize: scaleFontSize(16),
      color: '#000',
      fontWeight: '400',
      marginBottom: 10,
    },
  },
  button: {
    containerStyle: {
      width: Dimensions.get('window').width * 0.3,
      marginTop: 10,
      alignSelf: 'center',
      borderRadius: 5,
    },
    titleStyle: {
      fontWeight: '400',
      fontSize: scaleFontSize(16),
    },
  },

  textInput: {
    marginTop: 10,
    padding: 10,
    fontSize: scaleFontSize(16),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#EEEEEE',
    width: '100%',
  },
});
