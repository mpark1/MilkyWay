import React, {useCallback, useState, useEffect} from 'react';
import {StyleSheet, TextInput, View, Text, Dimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {CheckBox} from '@rneui/themed';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

const WriteOrEditLetter = ({navigation, route}) => {
  const {actionType, title, relationship, isPrivate, message} = route.params;

  useEffect(() => {
    navigation.setOptions(
      actionType === 'write'
        ? {headerTitle: '편지 작성하기'}
        : {headerTitle: '편지 수정하기'},
    );
  }, []);

  const renderTitleField = useCallback(() => {
    return (
      <View style={styles.inputField.container}>
        <Text style={styles.inputField.label}>제목</Text>
        <TextInput
          style={[styles.inputField.textInput]}
          placeholderTextColor={actionType === 'write' ? '#939393' : '#000'}
          placeholder={
            actionType === 'write' ? '제목을 입력하세요 (최대 20자)' : title
          }
        />
      </View>
    );
  }, []);

  const renderRelationshipField = useCallback(() => {
    return (
      <View style={styles.relationshipField.container}>
        <Text style={styles.inputField.label}>관계</Text>
        <TextInput
          style={styles.relationshipField.textInput}
          placeholderTextColor={actionType === 'write' ? '#939393' : '#000'}
          placeholder={
            actionType === 'write' ? '관계를 입력하세요' : relationship
          }
        />
      </View>
    );
  }, []);

  const [checked, setChecked] = useState(isPrivate);
  const toggleCheckbox = () => setChecked(!checked);

  const renderAccessLevelField = useCallback(() => {
    return (
      <View style={styles.relationshipField.container}>
        <Text style={styles.inputField.label}>접근설정</Text>
        <View style={styles.accessLevelField.checkBoxLabelContainer}>
          <CheckBox
            containerStyle={{padding: 0, marginLeft: 0}}
            size={24}
            checked={checked}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            checkedColor={'#000'}
          />
          <Text style={styles.accessLevelField.regularBlackFont}>
            나만 보기
          </Text>
        </View>
      </View>
    );
  }, [checked]);

  const renderMessageField = useCallback(() => {
    return (
      <View style={styles.messageField.container}>
        <Text style={styles.inputField.label}>글</Text>
        <TextInput
          style={styles.messageField.textInput}
          placeholderTextColor={actionType === 'write' ? '#939393' : '#000'}
          placeholder={
            actionType === 'write' ? '내용을 입력하세요 (최대 1000자)' : message
          }
          multiline={true}
          textAlign={'left'}
          textAlignVertical={'top'}
        />
      </View>
    );
  }, []);

  return (
    <KeyboardAwareScrollView style={[globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderTitleField()}
        {renderRelationshipField()}
        <Text style={styles.relationshipField.direction}>
          예: 엄마, 동생, 누나
        </Text>
        {renderAccessLevelField()}
        <Text style={styles.accessLevelField.direction}>
          선택시 작성자만 편지를 볼 수 있습니다.
        </Text>
        {renderMessageField()}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default WriteOrEditLetter;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.06,
  },
  inputField: {
    container: {
      marginBottom: Dimensions.get('window').height * 0.02,
      justifyContent: 'space-between',
    },
    label: {
      fontSize: scaleFontSize(18),
      fontWeight: 'bold',
      color: '#000',
      paddingVertical: 10,
    },
    textInput: {
      padding: 10,
      fontSize: scaleFontSize(18),
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#939393',
      width: '100%',
    },
  },
  relationshipField: {
    container: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: 0,
    },
    textInput: {
      width: '70%',
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: scaleFontSize(18),
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#939393',
    },
    direction: {
      color: '#939393',
      alignSelf: 'flex-end',
      lineHeight: scaleFontSize(24),
      width: '70%',
      marginBottom: Dimensions.get('window').height * 0.01,
    },
  },
  accessLevelField: {
    checkBoxLabelContainer: {
      width: '70%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    regularBlackFont: {
      fontSize: scaleFontSize(18),
      color: '#000',
    },
    direction: {
      color: '#939393',
      alignSelf: 'flex-end',
      width: '70%',
      marginBottom: Dimensions.get('window').height * 0.02,
    },
  },
  messageField: {
    container: {
      // marginBottom: Dimensions.get('window').height * 0.02,
    },
    textInput: {
      width: '100%',
      height: '65%',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#939393',
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: scaleFontSize(18),
      lineHeight: scaleFontSize(24),
    },
  },
});
