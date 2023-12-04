import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {scaleFontSize} from '../../assets/styles/scaling';

const AddNewPet = () => {
  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, {padding: 20}]}>
      <View style={styles.profilePicAndButtonWrapper}>
        <View style={styles.profilePicPlaceholder} />
        <View style={styles.addProfilePicButton}>
          <AntDesign name={'pluscircle'} size={35} color={'#6395E1'} />
        </View>
      </View>

      <View style={styles.inputFieldsWrapper}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름*</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'이름을 입력해주세요'}
          />
        </View>
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
  inputFieldsWrapper: {
    width: '100%',
    marginVertical: 20,
    borderWidth: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 30,
  },
  textInput: {},
});
