import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {CheckBox} from '@rneui/themed';
import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';
import BlueButton from '../../../components/Buttons/BlueButton';
import DropDownComponent from '../../../components/DropDownComponent';
import {calculateAge, getCurrentDate} from '../../../utils/utils';
import {mutationItemNoAlertBox} from '../../../utils/amplifyUtil';
import {updateUser} from '../../../graphql/mutations';
import {useSelector} from 'react-redux';
import {setUserGender} from '../../../redux/slices/User';

const TesteeInfo = ({navigation}) => {
  const {cognitoUsername, profilePicS3Key, email, name} = useSelector(
    state => state.user,
  );
  const [numberOfDeaths, setNumberOfDeaths] = useState(1);
  const [typePickerOpen, setTypePickerOpen] = useState(false);

  const [answer, setAnswer] = useState({
    gender: -1, // 0 - 여자, 1 - 남자
    birthdayString: '',
  });
  const currentDateInString = getCurrentDate();
  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [birthdayString, setBirthdayString] = useState('1920-01-01');
  const [birthday, setBirthday] = useState(new Date(currentDateInString));
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  const canGoNext = answer.gender !== -1 && answer.birthdayString.length !== 0;

  const onChangeBirthday = date => {
    setIsBirthdayPickerOpen(false);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );
    const localDateString = localDate.toISOString().split('T')[0];
    setBirthday(localDate);
    setBirthdayString(localDateString);
    updateAnswer('birthdayString', localDateString);
  };

  const updateAnswer = (fieldTitle, newValue) =>
    setAnswer(prev => ({
      ...prev,
      [fieldTitle]: newValue,
    }));

  const renderInstruction = () => {
    return (
      <Text style={styles.instruction}>심리 테스트 전 질문 몇개만 할게요.</Text>
    );
  };

  const renderDatePicker = () => {
    return (
      <DatePicker
        style={{width: 200, height: 40}}
        locale={'ko_KR'}
        modal
        mode={'date'}
        open={isBirthdayPickerOpen}
        date={birthday}
        maximumDate={new Date(currentDateInString)}
        minimumDate={new Date('1920-01-01')}
        onConfirm={newDate => {
          onChangeBirthday(newDate);
        }}
        onCancel={() => {
          setIsBirthdayPickerOpen(false);
        }}
      />
    );
  };

  const renderGenderField = () => {
    return (
      <View style={[styles.fieldContainer]}>
        <Text style={styles.text}>1. 성별</Text>
        <View style={{flexDirection: 'row'}}>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={answer.gender === 0}
            onPress={() => updateAnswer('gender', answer.gender === 0 ? -1 : 0)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={[styles.text, {marginLeft: 10, marginRight: 20}]}>
            여자
          </Text>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={answer.gender === 1}
            onPress={() => updateAnswer('gender', answer.gender === 1 ? -1 : 1)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={[styles.text, {marginLeft: 10}]}>남자</Text>
        </View>
      </View>
    );
  };

  const renderBirthdayField = () => {
    return (
      <View
        style={[
          styles.fieldContainer,
          {
            marginBottom: Dimensions.get('window').height * 0.02,
            alignItems: 'center',
          },
        ]}>
        <Text style={styles.text}>2. 생일</Text>
        <Pressable
          style={styles.datePicker}
          onPress={() => setIsBirthdayPickerOpen(true)}>
          <Text style={styles.datePickerPlaceholder}>
            {birthdayString !== '1920-01-01' ? birthdayString : 'YYYY-MM-DD'}
          </Text>
          {renderDatePicker('birthday')}
        </Pressable>
      </View>
    );
  };

  const setOptionsDropdown = () => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push({label: i, value: i});
    }
    return options;
  };

  const renderPastExperienceField = () => {
    return (
      <View style={styles.numOfDeathsContainer}>
        <Text style={styles.text}>3. 애완동물과의 이별을 경험한 횟수</Text>
        <DropDownComponent
          items={setOptionsDropdown()}
          value={numberOfDeaths}
          setValue={setNumberOfDeaths}
          open={typePickerOpen}
          setOpen={setTypePickerOpen}
          zIndex={100}
          whichPage={'Other'}
        />
      </View>
    );
  };

  const onSubmit = async () => {
    const inputObj = {
      id: cognitoUsername,
      email: email,
      profilePic: profilePicS3Key,
      name: name,
      state: 'ACTIVE',
      numOfDeadPets: numberOfDeaths,
      gender: answer.gender,
      birthday: answer.birthdayString,
      // age: calculateAge(birthday, 'human'),
    };
    // db update
    await mutationItemNoAlertBox(
      isCallingAPI,
      setIsCallingAPI,
      inputObj,
      updateUser,
    );
    // redux update
    setUserGender(answer.gender);
    navigation.navigate('PBQ');
  };

  const renderNextButton = () => {
    return (
      <View style={styles.nextButtonContainer}>
        <BlueButton
          disabled={!canGoNext | isCallingAPI}
          title={'테스트 시작'}
          onPress={onSubmit}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      {renderInstruction()}
      <View style={styles.spacer}>
        {renderGenderField()}
        {renderBirthdayField()}
        {renderPastExperienceField()}
      </View>
      {renderNextButton()}
    </SafeAreaView>
  );
};

export default TesteeInfo;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.08,
    paddingTop: Dimensions.get('window').height * 0.01,
  },
  instruction: {
    paddingHorizontal: 25,
    fontSize: scaleFontSize(18),
    color: '#374957',
    marginVertical: 15,
  },
  fieldContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: Dimensions.get('window').height * 0.02,
    width: '100%',
  },
  numOfDeathsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    color: '#374957',
  },
  checkBox: {
    padding: 0,
    marginRight: 0,
    marginLeft: 0,
    marginVertical: 0,
  },
  dropDownPicker: {
    containerStyle: {
      width: '50%',
      maxHeight: 37,
      backgroundColor: '#fff',
    },
  },
  nextButtonContainer: {
    width: Dimensions.get('window').width * 0.4,
    alignSelf: 'center',
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.1,
  },
  datePicker: {
    borderBottomWidth: 1,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  datePickerPlaceholder: {
    color: '#374957',
    fontSize: scaleFontSize(18),
  },
});
