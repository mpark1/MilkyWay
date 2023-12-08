import React, {useCallback, useRef, useState} from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import {Button} from '@rneui/base';
// import {updatePassword} from 'aws-amplify/auth';

import {scaleFontSize} from '../../assets/styles/scaling';
import globalStyle from '../../assets/styles/globalStyle';

import AlertBox from '../../components/AlertBox';

const ChangePassword = ({navigation}) => {
  const [oldPW, setOldPW] = useState('');
  const [newPW, setNewPW] = useState('');
  const [confirmNewPW, setConfirmNewPW] = useState('');

  const [isUpdatingPW, setIsUpdatingPW] = useState(false);

  const canGoNext = oldPW && newPW && confirmNewPW;

  const newPwRef = useRef(null);
  const confirmNewPwRef = useRef(null);

  const onChangeCurrPW = useCallback(text => {
    const trimmedText = text.trim();
    setOldPW(trimmedText);
  }, []);

  const onChangeNewPW = useCallback(text => {
    const trimmedText = text.trim();
    setNewPW(trimmedText);
  }, []);

  const onChangeConfirmNewPW = useCallback(text => {
    const trimmedText = text.trim();
    setConfirmNewPW(trimmedText);
  }, []);

  const renderInputFields = () => {
    return (
      <View style={styles.fieldsContainer}>
        <TextInput
          style={styles.currentPWTextInput}
          placeholder={'현재 비밀번호를 입력해주세요'}
          onChangeText={onChangeCurrPW}
          onSubmitEditing={() => newPwRef.current?.focus()}
          value={oldPW}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          secureTextEntry={true}
          textContentType={'password'}
          clearButtonMode={'while-editing'}
        />
        <TextInput
          ref={newPwRef}
          value={newPW}
          style={styles.newPWTextInput}
          placeholder={'새로운 비밀번호를 입력해주세요'}
          onChangeText={onChangeNewPW}
          onSubmitEditing={() => confirmNewPwRef.current?.focus()}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          secureTextEntry={true}
          textContentType={'newPassword'}
          clearButtonMode={'while-editing'}
        />
        <TextInput
          ref={confirmNewPwRef}
          value={confirmNewPW}
          style={styles.confirmNewPWTextInput}
          placeholder={'비밀번호를 한번 더 입력해주세요'}
          onChangeText={onChangeConfirmNewPW}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          secureTextEntry={true}
          textContentType={'password'}
          clearButtonMode={'while-editing'}
        />
      </View>
    );
  };

  async function onSubmit() {
    // 1. check password and confirm password (check for mismatch)
    if (confirmNewPW !== newPW) {
      setNewPW('');
      setConfirmNewPW('');
      return AlertBox('비밀번호가 일치하지 않습니다.', '', '확인', 'none');
    }

    if (!isUpdatingPW) {
      // 2. 광클방지
      setIsUpdatingPW(true);
      // 3. call api
      try {
        // await updatePassword({oldPassword: oldPW, newPassword: newPW}); //update a signed in user's password
      } catch (err) {
        // err.name 케이스별로 확인하기
        console.log(err);
      } finally {
        // 4. 정리
        setIsUpdatingPW(false);
      }
    }
  }

  const renderSubmitButton = () => {
    return (
      <View style={styles.blueButton}>
        <Button
          disabled={!canGoNext}
          title={'변경하기'}
          titleStyle={styles.submitButton.titleStyle}
          containerStyle={styles.submitButton.containerStyle}
          buttonStyle={globalStyle.backgroundBlue}
          onPress={onSubmit}
        />
      </View>
    );
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderInputFields()}
        {renderSubmitButton()}
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: 20,
    paddingVertical: Dimensions.get('window').height * 0.03,
  },
  containerForInput: {
    marginBottom: Dimensions.get('window').height * 0.025,
  },
  fieldsContainer: {
    width: '93%',
    alignSelf: 'center',
  },
  currentPWTextInput: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    fontSize: scaleFontSize(18),
    marginBottom: Dimensions.get('window').height * 0.03,
  },
  newPWTextInput: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    fontSize: scaleFontSize(18),
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  confirmNewPWTextInput: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    fontSize: scaleFontSize(18),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  blueButton: {
    alignSelf: 'center',
    paddingTop: Dimensions.get('window').height * 0.04,
  },
  submitButton: {
    titleStyle: {
      fontSize: scaleFontSize(16),
      color: '#FFF',
      fontWeight: '700',
      paddingVertical: 5,
      paddingHorizontal: 25,
    },
    containerStyle: {
      borderRadius: 10,
    },
  },
});
