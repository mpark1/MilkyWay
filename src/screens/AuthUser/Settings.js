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
import Ionicons from 'react-native-vector-icons/Ionicons';

const Settings = () => {
  // useEffect: fetch the latest user info from the User table

  const currentDateInString = getCurrentDate();

  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);

  const onChangeDate = useCallback((date, option) => {
    option === 'birthday'
      ? setIsBirthdayPickerOpen(false)
      : setIsDeathDayPickerOpen(false);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    const localDateString = localDate.toISOString().split('T')[0];

    option === 'birthday' ? setBirthday(localDate) : setDeathDay(localDate);
    option === 'birthday'
      ? setBirthdayString(localDateString)
      : setDeathDayString(localDateString);
  }, []);

  const [birthdayString, setBirthdayString] = useState('2012-02-03');
  const [birthday, setBirthday] = useState(new Date(birthdayString));
  const [deathDayString, setDeathDayString] = useState('2023-02-03');
  const [deathDay, setDeathDay] = useState(new Date(deathDayString));

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

  const renderDatePicker = option => {
    return (
      <DatePicker
        locale={'ko_KR'}
        modal
        mode={'date'}
        open={
          option === 'birthday' ? isBirthdayPickerOpen : isDeathDayPickerOpen
        }
        date={option === 'birthday' ? birthday : deathDay}
        maximumDate={new Date(currentDateInString)}
        onConfirm={newDate => {
          onChangeDate(newDate, option);
        }}
        onCancel={() => {
          option === 'birthday'
            ? setIsBirthdayPickerOpen(false)
            : setIsDeathDayPickerOpen(false);
        }}
      />
    );
  };

  const renderBirthdayField = () => {
    return (
      <View style={styles.birthdayField.container}>
        <Text style={styles.nameField.label}>생일</Text>
        <Pressable
          style={styles.nameField.textInput}
          onPress={() => setIsBirthdayPickerOpen(true)}>
          <Text style={styles.birthdayField.placeholder}>{birthdayString}</Text>
          {renderDatePicker('birthday')}
        </Pressable>
      </View>
    );
  };

  const renderDeathDayField = () => {
    return (
      <View style={styles.birthdayField.container}>
        <Text style={styles.nameField.label}>기일</Text>
        <Pressable
          style={styles.nameField.textInput}
          onPress={() => setIsDeathDayPickerOpen(true)}>
          <Text style={styles.birthdayField.placeholder}>{deathDayString}</Text>
          {renderDatePicker('deathDay')}
        </Pressable>
      </View>
    );
  };

  const renderLastWordField = useCallback(() => {
    return (
      <View style={styles.lastWordField.container}>
        <Text style={styles.lastWordField.label}>마지막 인사</Text>
        <TextInput
          style={styles.lastWordField.textInput}
          placeholder={'천사같은 마루 이제 편히 잠들길.....'}
          multiline={true}
          placeholderTextColor={'#000'}
          textAlign={'left'}
          textAlignVertical={'top'}
          blurOnSubmit={true}
        />
      </View>
    );
  }, []);

  const renderAccessLevelField = useCallback(() => {
    return (
      <View style={styles.accessLevelField.container}>
        <View style={styles.accessLevelField.flexDirectionRow}>
          <Text style={styles.accessLevelField.label}>추모공간 접근 설정</Text>
          <Ionicons name={'information-circle'} color={'#000'} size={24} />
        </View>
      </View>
    );
  }, []);

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderProfilePic()}
        {renderNameField()}
        {renderBirthdayField()}
        {renderDeathDayField()}
        {renderLastWordField()}
        {renderAccessLevelField()}
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
  lastWordField: {
    container: {
      flexDirection: 'row',
      width: '90%',
      marginBottom: Dimensions.get('window').height * 0.04,
    },
    label: {
      fontSize: scaleFontSize(20),
      color: '#000',
      marginRight: Dimensions.get('window').width * 0.04,
      alignSelf: 'center',
    },
    textInput: {
      fontSize: scaleFontSize(18),
      lineHeight: scaleFontSize(24),
      color: '#000',
      borderWidth: 1,
      borderColor: '#d9d9d9',
      borderRadius: 5,
      padding: 10,
      flex: 1,
    },
  },
  accessLevelField: {
    label: {
      fontSize: scaleFontSize(20),
      color: '#000',
      marginRight: Dimensions.get('window').width * 0.04,
    },
    flexDirectionRow: {
      flexDirection: 'row',
    },
  },
});
