import React, {useCallback, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {scaleFontSize} from '../../assets/styles/scaling';
import globalStyle from '../../assets/styles/globalStyle';
import {Button} from '@rneui/base';
import {confirmSignUp} from 'aws-amplify/auth';
import AlertBox from '../../components/AlertBox';

const ConfirmAccount = ({navigation, route}) => {
  const [code, setCode] = useState('');
  const {username} = route.params;
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const canGoNext = code;
  const onChangeCode = useCallback(text => {
    setCode(text.trim());
  }, []);

  async function goNext() {
    if (isConfirmed || isConfirming) {
      return;
    }
    setIsConfirming(true);
    try {
      console.log('email: ', username);
      console.log('code: ', code);
      const {isSignUpComplete, nextStep} = await confirmSignUp({
        username: username,
        confirmationCode: code,
      });
      setIsConfirmed(true);
      console.log('isSignUpComplete', isSignUpComplete);
      console.log('nextStep', nextStep);
      AlertBox('회원가입 성공!', '', '확인', () => navigation.navigate('Pets'));
    } catch (error) {
      console.log('error message', error);
      if (error.name === 'CodeMismatchException') {
        AlertBox(
          '인증번호가 일치하지 않습니다',
          '인증번호를 다시 확인해주세요',
          '확인',
          'none',
        );
      } else if (error.code === 'LimitExceededException') {
        AlertBox(
          '인증번호 오류 횟수를 초과하였습니다.',
          '잠시후(정확히 몇분?) 다시 시도해주세요.',
          '확인',
          'none',
        );
      }
    } finally {
      setIsConfirming(false);
    }
  }

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
        <Button onPress={() => goNext()} disabled={!canGoNext} title={'확인'} />
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
