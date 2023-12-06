import React, {useCallback, useState} from 'react';
import {View, Alert, StyleSheet, Dimensions} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import {Button, Input} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';
import {resetPassword} from 'aws-amplify/auth';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');

  const [isSendingConfirmationCode, setIsSendingConfirmationCode] =
    useState(false);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
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

  return (
    <View style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.spacer}>
        {renderEmailField()}
        {renderGoNextButton()}
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
});
