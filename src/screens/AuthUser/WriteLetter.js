import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Text, Dimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CheckBox} from '@rneui/themed';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';
import BlueButton from '../../components/Buttons/BlueButton';
import {createLetter} from '../../graphql/mutations';
import {useSelector} from 'react-redux';
import {mutationItem} from '../../utils/amplifyUtil';

const WriteLetter = ({navigation}) => {
  const petID = useSelector(state => state.pet.id);
  const [newTitle, setNewTitle] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const userID = useSelector(state => state.user.cognitoUsername);
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  // check box
  const [checked, setChecked] = useState(false);
  const toggleCheckbox = () => setChecked(!checked);

  const renderTitleField = () => {
    return (
      <View style={styles.inputField.container}>
        <Text style={styles.inputField.label}>제목</Text>
        <TextInput
          style={styles.inputField.textInput}
          placeholderTextColor={'#939393'}
          placeholder={'제목을 입력하세요 (최대 20자)'}
          clearButtonMode={'while-editing'}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={input => {
            setNewTitle(input);
          }}
        />
      </View>
    );
  };

  const renderRelationshipField = () => {
    return (
      <View>
        <View style={styles.relationshipField.container}>
          <Text style={styles.inputField.label}>관계</Text>
          <View
            style={{
              width: '77%',
            }}>
            <TextInput
              style={styles.relationshipField.textInput}
              placeholderTextColor={'#939393'}
              placeholder={'관계를 입력하세요'}
              clearButtonMode={'while-editing'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={input => {
                setNewRelationship(input);
              }}
            />
            <Text style={styles.relationshipField.example}>
              예: 엄마, 동생, 누나
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAccessLevelField = () => {
    return (
      <View style={styles.accessLevelField.container}>
        <Text style={styles.inputField.label}>접근설정</Text>
        <View style={styles.accessLevelField.nonLabels.container}>
          <View style={styles.accessLevelField.nonLabels.firstRow}>
            <CheckBox
              containerStyle={styles.accessLevelField.checkBoxContainer}
              size={24}
              checked={checked}
              onPress={toggleCheckbox}
              iconType="material-community"
              checkedIcon="checkbox-outline"
              uncheckedIcon={'checkbox-blank-outline'}
              checkedColor={'#494444'}
            />
            <Text
              style={{
                fontSize: scaleFontSize(18),
                color: checked ? '#494444' : '#939393',
              }}>
              나만 보기
            </Text>
          </View>
          <Text style={styles.accessLevelField.nonLabels.direction}>
            선택시 작성자만 편지를 볼 수 있습니다
          </Text>
        </View>
      </View>
    );
  };

  const renderMessageField = () => {
    return (
      <View style={styles.messageField.container}>
        <Text style={styles.inputField.label}>글</Text>
        <TextInput
          style={styles.messageField.textInput}
          placeholderTextColor={'#939393'}
          placeholder={'내용을 입력하세요 (최대 1000자)'}
          multiline={true}
          textAlign={'left'}
          textAlignVertical={'top'}
          clearButtonMode={'while-editing'}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={input => {
            setNewMessage(input);
          }}
        />
      </View>
    );
  };

  function popPage() {
    navigation.pop();
  }

  const onSubmit = () => {
    const newLetterInput = {
      petID: petID,
      title: newTitle,
      relationship: newRelationship,
      content: newMessage,
      accessLevel: checked ? 'PRIVATE' : 'PUBLIC',
      letterAuthorId: userID,
    };
    mutationItem(
      isCallingAPI,
      setIsCallingAPI,
      newLetterInput,
      createLetter,
      '편지가 성공적으로 등록되었습니다.',
      popPage,
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.spacer}>
        {renderTitleField()}
        {renderRelationshipField()}
        {renderAccessLevelField()}
        {renderMessageField()}
        <View style={styles.blueButton}>
          <BlueButton title={'등록하기'} onPress={() => onSubmit()} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default WriteLetter;

const styles = StyleSheet.create({
  spacer: {
    paddingVertical: Dimensions.get('window').height * 0.017,
    paddingHorizontal: Dimensions.get('window').width * 0.06,
  },
  inputField: {
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Dimensions.get('window').height * 0.035,
    },
    label: {
      fontSize: scaleFontSize(18),
      fontWeight: 'bold',
      color: '#000',
    },
    textInput: {
      width: '77%',
      paddingTop: 0,
      paddingBottom: 3,
      paddingHorizontal: 10,
      fontSize: scaleFontSize(18),
      borderBottomWidth: 1,
      borderRadius: 10,
      borderColor: '#d9d9d9',
    },
  },
  relationshipField: {
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: Dimensions.get('window').height * 0.035,
    },
    example: {
      width: '100%',
      alignSelf: 'flex-end',
      paddingLeft: 10,
      color: '#939393',
      lineHeight: scaleFontSize(24),
    },
    textInput: {
      paddingTop: 0,
      paddingLeft: 10,
      fontSize: scaleFontSize(18),
      borderBottomWidth: 1,
      borderRadius: 10,
      borderColor: '#d9d9d9',
      width: '100%',
      paddingBottom: 3,
    },
  },
  accessLevelField: {
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: Dimensions.get('window').height * 0.027,
    },
    checkBoxContainer: {
      padding: 0,
      marginRight: 5,
      marginLeft: 0,
      marginVertical: 0,
    },
    nonLabels: {
      firstRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      container: {
        width: '75%',
      },
      direction: {
        width: '100%',
        alignSelf: 'flex-end',
        color: '#939393',
        lineHeight: scaleFontSize(24),
      },
    },
  },
  messageField: {
    container: {
      height: Dimensions.get('window').height * 0.4,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#d9d9d9',
      marginTop: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: scaleFontSize(18),
      lineHeight: scaleFontSize(24),
    },
  },
  blueButton: {
    marginVertical: Dimensions.get('window').height * 0.07,
    alignSelf: 'center',
  },
});
