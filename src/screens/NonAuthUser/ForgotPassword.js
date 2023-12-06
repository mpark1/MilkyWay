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

  const onSubmit = useCallback(async () => {
    if (!isSendingConfirmationCode) {
      setIsSendingConfirmationCode(true);
      try {
        const output = await resetPassword({username: email});
        handleResetPasswordNextSteps(output);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSendingConfirmationCode(false);
      }
    }
  }, []);

  function handleResetPasswordNextSteps(output) {
    const {nextStep} = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`,
        );
        // Collect the confirmation code from the user and pass to confirmResetPassword.
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
    } catch (error) {
      console.log(error);
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
              borderBottomWidth: 0,
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
        title={'비밀번호 재설정'}
        titleStyle={styles.button.titleStyle}
        containerStyle={styles.button.containerStyle}
        buttonStyle={globalStyle.backgroundBlue}
        disabled={!(code && newPW && confirmNewPW)}
        onPress={() => handleConfirmResetPassword()}
      />
    );
  };

  return (
    <View style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.spacer}>
        {renderEmailField()}
        {renderGoNextButton()}
        {renderConfirmationCodeField()}
        {renderNewPWField()}
        {renderConfirmResetPWButton()}
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
      fontSize: scaleFontSize(18),
    },
  },

  textInput: {
    marginTop: 10,
    padding: 10,
    fontSize: scaleFontSize(18),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#EEEEEE',
    width: '100%',
  },
});
