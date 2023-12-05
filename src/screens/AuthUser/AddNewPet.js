import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {scaleFontSize} from '../../assets/styles/scaling';

const AddNewPet = () => {
  const renderNameField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.04}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름*</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'이름을 입력해주세요'}
            placeholderTextColor={'#939393'}
          />
        </View>
      </View>
    );
  };

  const renderBirthdayField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.04}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>생일*</Text>
          <Pressable style={styles.textInput}>
            <Text style={styles.datePlaceholder}>YYYY-MM-DD</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderDeathDayField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.03}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>기일*</Text>
          <Pressable style={styles.textInput}>
            <Text style={styles.datePlaceholder}>YYYY-MM-DD</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderLastWordField = () => {
    return (
      <View>
        <Text style={styles.label}>멀리 떠나는 아이에게 전하는 인사말</Text>
        <TextInput
          placeholder={
            '예: 천사같은 마루 이제 편히 잠들기를.... (최대 30자 이내)'
          }
          placeholderTextColor={'#d9d9d9'}
        />
      </View>
    );
  };

  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, {padding: 20}]}>
      <View style={styles.profilePicAndButtonWrapper}>
        <View style={styles.profilePicPlaceholder} />
        <View style={styles.addProfilePicButton}>
          <AntDesign name={'pluscircle'} size={35} color={'#6395E1'} />
        </View>
      </View>

      <View style={styles.inputFieldsContainer}>
        {renderNameField()}
        {renderBirthdayField()}
        {renderDeathDayField()}
        {renderLastWordField()}
      </View>
    </View>
  );
};

export default AddNewPet;

const styles = StyleSheet.create({
  profilePicAndButtonWrapper: {
    width: 160,
    height: 160,
    alignSelf: 'center',
  },
  profilePicPlaceholder: {
    width: 152,
    height: 152,
    borderRadius: 152 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  addProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  inputFieldsContainer: {
    width: '95%',
    marginVertical: 20,
    // borderWidth: 1,
    alignSelf: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 30,
    color: '#000',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: scaleFontSize(16),
    textAlign: 'center',
  },
  datePlaceholder: {
    fontSize: scaleFontSize(16),
    color: '#939393',
    textAlign: 'center',
  },
  lastWord: {
    textInput: {},
  },
});
