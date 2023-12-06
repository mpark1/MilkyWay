import React, {useCallback, useState} from 'react';
import {View, Alert, StyleSheet, Dimensions} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import {Button, Input} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';

const FindPassword = ({navigation}) => {
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
        // TODO: 1. Call Amplify auth forgotPassword(email), 2. Handle any error, 3. If no error, navigate to ResetPassword (pass email as param)
      } catch (error) {
      } finally {
        setIsSendingConfirmationCode(false);
      }
    }
  }, []);

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
        onPress={onSubmit}
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

export default FindPassword;

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
      color: '#d9d9d9',
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
