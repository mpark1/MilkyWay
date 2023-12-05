import React, {useCallback, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {scaleFontSize} from '../../assets/styles/scaling';
import globalStyle from '../../assets/styles/globalStyle';
import {Button} from '@rneui/base';
// import {Auth} from 'aws-amplify';

const ConfirmAccount = () => {
  const [code, setCode] = useState('');

  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const canGoNext = code;
  const onChangeCode = useCallback(text => {
    setCode(text.trim());
  }, []);

  // async function confirmSignUp(username, code) {
  //   if (isConfirmed || isConfirming) {
  //     return;
  //   }
  //   setIsConfirming(true);
  //   try {
  //     await Auth.confirmSignUp(username, code);
  //     setIsConfirmed(true);
  //     console.log('email confirmation success');
  //     // console.log(imageURI);
  //     // await createProfileImageInS3(imageURI);
  //
  //     if (purpose === 'signUp') {
  //       Alert.alert('이메일 인증 성공!', '', [
  //         {text: '확인', onPress: () => navigation.navigate('CompleteSignUp')},
  //       ]);
  //     } else if (purpose === 'resend') {
  //       Alert.alert('이메일 인증 성공!', '', [
  //         {text: '로그인하기', onPress: () => navigation.navigate('SignIn')},
  //       ]);
  //     }
  //   } catch (error) {
  //     if (error.code === 'CodeMismatchException') {
  //       Alert.alert(
  //         '인증번호가 일치하지 않습니다. 인증번호를 확인해주세요',
  //         '',
  //         [{text: '확인'}],
  //       );
  //     } else if (error.code === 'LimitExceededException') {
  //       Alert.alert(
  //         '인증번호 오류 횟수를 초과하였습니다. 잠시후(정확히 몇분?) 다시 시도해주세요.',
  //         '',
  //         [{text: '확인'}],
  //       );
  //     }
  //   } finally {
  //     setIsConfirming(false);
  //   }
  // }

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.container}>
        <View style={{marginBottom: 23}}>
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
        <Button
          // onPress={() => confirmSignUp(email, code)}
          disabled={!canGoNext}
          title={'확인'}
        />
        <View style={{marginTop: 10}}>
          <Text>
            계정 인증 메일이 오지 않는다면 스팸 혹은 프로모션 메일함을
            확인해주세요.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ConfirmAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
  },
  textInput: {
    marginTop: 10,
    padding: 10,
    fontSize: scaleFontSize(18),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#EEEEEE',
  },
  subHeader: {
    fontSize: scaleFontSize(20),
    lineHeight: scaleFontSize(24),
    color: '#374957',
  },
});
