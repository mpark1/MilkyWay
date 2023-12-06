import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import BlueButton from '../../components/Buttons/BlueButton';
import {getCurrentDate, isValidBirthdayDeathDay} from '../../utils/utils';

const AddNewPet = ({navigation}) => {
  const [name, setName] = useState('');
  const [lastWord, setLastWord] = useState('');

  const currentDateInString = getCurrentDate();
  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);

  const onChangeName = useCallback(text => {
    const trimmedText = text.trim();
    setName(trimmedText);
  }, []);

  const onChangeLastWord = useCallback(text => {
    setLastWord(text);
  }, []);

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

  const [birthdayString, setBirthdayString] = useState('YYYY-MM-DD');
  const [birthday, setBirthday] = useState(new Date());
  const [deathDayString, setDeathDayString] = useState('YYYY-MM-DD');
  const [deathDay, setDeathDay] = useState(new Date());

  const renderNameField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.04}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름*</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'이름을 입력해주세요'}
            placeholderTextColor={'#939393'}
            onChangeText={onChangeName}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={name}
            blurOnSubmit={true}
            clearButtonMode={'while-editing'}
          />
        </View>
      </View>
    );
  };

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
      <View style={{marginBottom: Dimensions.get('window').height * 0.04}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>생일*</Text>
          <Pressable
            style={styles.textInput}
            onPress={() => setIsBirthdayPickerOpen(true)}>
            <Text style={styles.datePlaceholder}>{birthdayString}</Text>
            {renderDatePicker('birthday')}
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
          <Pressable
            style={styles.textInput}
            onPress={() => setIsDeathDayPickerOpen(true)}>
            <Text style={styles.datePlaceholder}>{deathDayString}</Text>
            {renderDatePicker('deathDay')}
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
          style={styles.lastWord.textInput}
          placeholder={'예: 천사같은 마루 이제 편히 잠들기를.... (최대 30자)'}
          placeholderTextColor={'#939393'}
          multiline={true}
          textAlign={'left'}
          textAlignVertical={'top'}
          maxLength={30}
          autoCorrect={false}
          autoCapitalize={'none'}
          blurOnSubmit={true}
          clearButtonMode={'while-editing'}
          onChangeText={onChangeLastWord}
          value={lastWord}
        />
      </View>
    );
  };

  const goNext = useCallback(() => {
    if (birthdayString > deathDayString) {
      return Alert.alert('생일과 기일을 다시 한번 확인해주세요', '', [
        {
          text: '확인',
        },
      ]);
    }
    navigation.navigate('SetAccessLevel', {
      name: name,
      birthday: birthdayString,
      deathDay: deathDayString,
      lastWord: lastWord,
    });
  }, [birthdayString, deathDayString, name, lastWord]);

  const canGoNext =
    name && birthdayString !== 'YYYY-MM-DD' && deathDayString !== 'YYYY-MM-DD';

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite, {padding: 20}]}>
      <View style={styles.profilePicAndButtonWrapper}>
        <View style={styles.profilePicPlaceholder} />
        <View style={styles.addProfilePicButton}>
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </View>
      </View>

      <View style={styles.inputFieldsContainer}>
        {renderNameField()}
        {renderBirthdayField()}
        {renderDeathDayField()}
        {renderLastWordField()}
        <Text style={styles.requiredText}>*필수 기입 항목입니다.</Text>
      </View>
      <View style={styles.blueButtonContainer}>
        <BlueButton disabled={!canGoNext} title={'다음'} onPress={goNext} />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddNewPet;

const styles = StyleSheet.create({
  profilePicAndButtonWrapper: {
    width: Dimensions.get('window').width * 0.36,
    height: Dimensions.get('window').width * 0.36,
    alignSelf: 'center',
  },
  profilePicPlaceholder: {
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').width * 0.35,
    borderRadius: (Dimensions.get('window').width * 0.35) / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  addProfilePicButton: {
    position: 'absolute',
    bottom: 0,
    right: Dimensions.get('window').width * 0.02,
  },
  inputFieldsContainer: {
    width: '95%',
    marginVertical: Dimensions.get('window').height * 0.05,
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
    textInput: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderWidth: 1,
      borderColor: '#d9d9d9',
      borderRadius: 5,
      height: Dimensions.get('window').height * 0.08,
      marginVertical: Dimensions.get('window').height * 0.01,
      fontSize: scaleFontSize(16),
      lineHeight: scaleFontSize(20),
    },
  },
  requiredText: {},
  blueButtonContainer: {
    width: Dimensions.get('window').width * 0.27,
    alignSelf: 'center',
    paddingVertical: Dimensions.get('window').height * 0.006,
  },
});
