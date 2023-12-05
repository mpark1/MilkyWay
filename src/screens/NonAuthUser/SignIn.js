import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {scaleFontSize} from '../../assets/styles/scaling';
import {Button, Input} from '@rneui/base';
import {CheckBox} from '@rneui/themed';
import globalStyle from '../../assets/styles/globalStyle';

const SignIn = () => {
  const renderEmailField = () => {
    return (
      <Input
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        label="이메일*"
        labelStyle={styles.labelStyle}
        placeholder="   이메일을 입력해주세요"
        placeholderTextColor={'#d9d9d9'}
      />
    );
  };

  const renderPasswordField = () => {
    return (
      <Input
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        label="비밀번호*"
        labelStyle={styles.labelStyle}
        placeholder="   비밀번호를 입력해주세요"
        placeholderTextColor={'#d9d9d9'}
      />
    );
  };

  const [checked, setChecked] = useState(true);
  const toggleCheckbox = () => setChecked(!checked);

  const renderAutoLogin = () => {
    return (
      <CheckBox
        checked={checked}
        onPress={toggleCheckbox}
        iconType="material-community"
        checkedIcon="checkbox-outline"
        uncheckedIcon={'checkbox-blank-outline'}
      />
    );
  };
  const renderButtons = () => {
    return (
      <>
        <Button
          title={'로그인'}
          titleStyle={{fontWeight: 'bold', fontSize: scaleFontSize(20)}}
          containerStyle={{
            width: Dimensions.get('window').width * 0.7,
            marginTop: 10,
            alignSelf: 'center',
            borderRadius: 25,
          }}
          buttonStyle={{
            backgroundColor: '#6395E1',
          }}
        />

        <Button
          title={'회원가입'}
          titleStyle={{
            fontWeight: 'bold',
            fontSize: scaleFontSize(20),
            color: '#6395E1',
          }}
          type={'outline'}
          buttonStyle={{
            borderColor: '#6395E1',
            borderRadius: 25,
          }}
          containerStyle={{
            width: Dimensions.get('window').width * 0.7,
            marginVertical: 10,
            alignSelf: 'center',
            // borderRadius: 25,
          }}
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
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  appName: {
    alignSelf: 'center',
    fontSize: scaleFontSize(20),
    fontWeight: '700',
    color: '#000',
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
    color: '#d9d9d9',
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
});
