import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  Pressable,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import {getCurrentDate} from '../../utils/utils';

const Settings = () => {
  // useEffect: fetch the latest user info from the User table

  const currentDateInString = getCurrentDate();

  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);

  const onChangeBirthday = useCallback(date => {
    setIsBirthdayPickerOpen(false);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );
  }, []);

  // const onChangeDate = date => {
  //   setIsPickerOpen(false);
  //
  //   const localDate = new Date(
  //     date.getTime() - date.getTimezoneOffset() * 60000,
  //   );
  //
  //   setBirthday(localDate);
  //   setBirthdayString(localDate.toISOString().split('T')[0]);
  // };

  const birthdayString = '2012-02-03';
  const birthday = new Date(birthdayString);
  const deathDayString = '2023-02-03';
  const deathDay = new Date(deathDayString);

  const renderProfilePic = useCallback(() => {
    return (
      <View style={styles.profilePicContainer}>
        <Image
          resizeMode={'cover'}
          style={styles.profilePic}
          source={require('../../assets/images/cat.jpeg')}
        />
        <Pressable style={styles.plusButton}>
          <View style={styles.plusButtonCanvas} />
          <AntDesign name={'pluscircle'} size={35} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  }, []);

  const renderNameField = useCallback(() => {
    return (
      <View style={styles.nameField.container}>
        <Text style={styles.nameField.label}>이름</Text>
        <TextInput
          placeholder={'마루'}
          placeholderTextColor={'#000'}
          style={styles.nameField.textInput}
        />
      </View>
    );
  }, []);

  const renderBirthdayField = useCallback(() => {
    return (
      <View style={styles.birthdayField.container}>
        <Text style={styles.nameField.label}>생일</Text>
        <Pressable style={styles.nameField.textInput}>
          <Text style={styles.birthdayField.placeholder}>{birthdayString}</Text>
          <DatePicker
            locale={'ko_KR'}
            modal
            mode={'date'}
            open={isBirthdayPickerOpen}
            date={birthday}
            maximumDate={new Date(currentDateInString)}
            // onConfirm={birthday => {
            //   onChangeDate(birthday);
            //   userObject.petBirthday = birthdayString;
            // }}
            // onCancel={() => {
            //   setIsPickerOpen(false);
            // }}
          />
        </Pressable>
      </View>
    );
  }, []);

  const renderDeathDayField = useCallback(() => {
    return (
      <View style={styles.birthdayField.container}>
        <Text style={styles.nameField.label}>기일</Text>
        <Pressable style={styles.nameField.textInput}>
          <Text style={styles.birthdayField.placeholder}>{deathDayString}</Text>
          <DatePicker
            locale={'ko_KR'}
            modal
            mode={'date'}
            // open={isPickerOpen}
            date={deathDay}
            maximumDate={new Date(currentDateInString)}
            // onConfirm={date => {
            //   onChangeDate(date);
            //   userObject.petBirthday = birthdayString;
            // }}
            // onCancel={() => {
            //   setIsPickerOpen(false);
            // }}
          />
        </Pressable>
      </View>
    );
  }, []);

  const renderLastWordField = useCallback(() => {}, []);

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderProfilePic()}
        {renderNameField()}
        {renderBirthdayField()}
        {renderDeathDayField()}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  spacer: {
    paddingVertical: Dimensions.get('window').height * 0.01,
    paddingHorizontal: Dimensions.get('window').width * 0.1,
    alignItems: 'center',
  },
  profilePicContainer: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4,
    alignSelf: 'center',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: Dimensions.get('window').width * 0.2,
  },
  plusButton: {
    position: 'absolute',
    bottom: 10,
    right: 5,
  },
  plusButtonCanvas: {
    width: 25,
    height: 25,
    position: 'absolute',
    backgroundColor: '#FFF',
    bottom: 2,
    right: 5,
  },
  nameField: {
    container: {
      width: '90%',
      paddingVertical: Dimensions.get('window').height * 0.04,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: scaleFontSize(20),
      color: '#000',
    },
    textInput: {
      fontSize: scaleFontSize(18),
      color: '#000',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: '#939393',
      textAlign: 'center',
      flex: 1,
      paddingTop: 0,
      paddingBottom: 5,
      marginLeft: '10%',
    },
  },
  birthdayField: {
    container: {
      width: '90%',
      paddingBottom: Dimensions.get('window').height * 0.04,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    placeholder: {
      fontSize: scaleFontSize(18),
      color: '#000',
      textAlign: 'center',
    },
  },
});
