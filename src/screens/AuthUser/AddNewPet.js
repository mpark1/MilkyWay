import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import {Button} from '@rneui/base';
import {CheckBox} from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setNewPetGeneralInfo} from '../../redux/slices/NewPet';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';
import {getCurrentDate, getMonthsElapsed} from '../../utils/utils';
import SinglePictureBottomSheetModal from '../../components/SinglePictureBottomSheetModal';
import DropDownComponent from '../../components/DropDownComponent';
import {
  monthOptions,
  yearOptions,
} from '../../constants/petOwnershipPeriodYearsMonths';

const AddNewPet = ({navigation}) => {
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState('');
  const bottomSheetModalRef = useRef(null);
  const currentDateInString = getCurrentDate();

  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);

  const [birthdayString, setBirthdayString] = useState('1920-01-01');
  const [deathDayString, setDeathDayString] = useState(currentDateInString + 1);

  const [birthday, setBirthday] = useState(new Date(currentDateInString));
  const [deathDay, setDeathDay] = useState(new Date(currentDateInString));

  const [petName, setPetName] = useState('');

  const [years, setYears] = useState(-1);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [months, setMonths] = useState(-1);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const [answer, setAnswer] = useState({
    ownerSinceBirth: -1,
    caretakerType: -1,
  });

  const canGoNext =
    petName &&
    birthdayString !== 'YYYY-MM-DD' &&
    deathDayString !== 'YYYY-MM-DD' &&
    (answer.ownerSinceBirth === 0 ||
      (answer.ownerSinceBirth === 1 && (months !== -1 || years !== -1))) &&
    answer.caretakerType !== -1;

  const updateAnswer = (fieldTitle, newValue) =>
    setAnswer(prev => ({
      ...prev,
      [fieldTitle]: newValue,
    }));

  const onChangeDate = (date, option) => {
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
  };

  const renderProfilePicField = () => {
    return (
      <View style={styles.profilePicAndButtonWrapper}>
        {profilePic ? (
          <View style={styles.profilePicPlaceholder}>
            <Image style={styles.profilePic} source={{uri: profilePic}} />
          </View>
        ) : (
          <View style={styles.profilePicPlaceholder} />
        )}
        <Pressable
          onPress={() => bottomSheetModalRef.current?.present()}
          style={styles.addProfilePicButton}>
          <View style={styles.addProfilePicButton} />
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </Pressable>
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
        maximumDate={
          option === 'birthday'
            ? new Date(deathDayString)
            : new Date(currentDateInString)
        }
        minimumDate={
          option === 'deathDay'
            ? new Date(birthdayString)
            : new Date('1920-01-01')
        }
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

  const renderNameField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름*</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'이름을 입력해주세요'}
            placeholderTextColor={'#939393'}
            autoCorrect={false}
            onChangeText={text => {
              setPetName(text);
            }}
          />
        </View>
      </View>
    );
  };

  const renderBirthdayField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>생일*</Text>
          <Pressable
            style={styles.textInput}
            onPress={() => setIsBirthdayPickerOpen(true)}>
            <Text style={styles.datePlaceholder}>
              {' '}
              {birthdayString !== '1920-01-01'
                ? birthdayString
                : '날짜를 선택해 주세요'}
            </Text>
            {renderDatePicker('birthday')}
          </Pressable>
        </View>
      </View>
    );
  };

  const renderDeathDayField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>기일*</Text>
          <Pressable
            style={styles.textInput}
            onPress={() => setIsDeathDayPickerOpen(true)}>
            <Text style={styles.datePlaceholder}>
              {' '}
              {deathDayString !== currentDateInString + 1
                ? deathDayString
                : '날짜를 선택해 주세요'}
            </Text>
            {renderDatePicker('deathDay')}
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPetOwnershipField = () => {
    return (
      <View style={[styles.containerForInput, {marginVertical: 10}]}>
        <Text style={styles.label}>아이가 태어났을 때부터 키우셨나요?</Text>
        <View style={styles.checkBoxes}>
          <Text style={styles.checkBoxes.text}>예</Text>
          <CheckBox
            containerStyle={[styles.checkBoxes.checkBox, {marginRight: 20}]}
            size={24}
            checked={answer.ownerSinceBirth === 0}
            onPress={() =>
              updateAnswer(
                'ownerSinceBirth',
                answer.ownerSinceBirth === 0 ? -1 : 0,
              )
            }
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#939393'}
            checkedColor={'#6395E1'}
          />
          <Text style={styles.checkBoxes.text}>아니오</Text>
          <CheckBox
            containerStyle={styles.checkBoxes.checkBox}
            size={24}
            checked={answer.ownerSinceBirth === 1}
            onPress={() =>
              updateAnswer(
                'ownerSinceBirth',
                answer.ownerSinceBirth === 1 ? -1 : 1,
              )
            }
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#939393'}
            checkedColor={'#6395E1'}
          />
        </View>
        {answer.ownerSinceBirth === 1 && renderYearMonthField()}
      </View>
    );
  };

  const renderYearMonthField = () => {
    return (
      <View style={styles.yearMonthFieldContainer}>
        <Text style={styles.label}>양육 기간</Text>
        <DropDownComponent
          items={yearOptions}
          setValue={setYears}
          value={years}
          open={yearPickerOpen}
          setOpen={setYearPickerOpen}
          zIndex={10}
          whichPage={'AddNewPet'}
          placeholderText={''}
        />
        <Text style={styles.label}>
          {'  '}년{'   '}
        </Text>
        <DropDownComponent
          items={monthOptions}
          setValue={setMonths}
          value={months}
          open={monthPickerOpen}
          setOpen={setMonthPickerOpen}
          zIndex={100}
          whichPage={'AddNewPet'}
          placeholderText={''}
        />
        <Text style={styles.label}>{'  '}개월</Text>
      </View>
    );
  };

  const renderCaretakerField = () => {
    return (
      <View style={[styles.flexDirectionRow, {zIndex: 10}]}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.checkBoxes.text}>1인 보호자</Text>
          <CheckBox
            containerStyle={styles.checkBoxes.checkBox}
            size={24}
            checked={answer.caretakerType === 0}
            onPress={() =>
              updateAnswer('caretakerType', answer.caretakerType === 0 ? -1 : 0)
            }
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#939393'}
            checkedColor={'#6395E1'}
          />
        </View>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.checkBoxes.text}>가족 단위 보호자</Text>
          <CheckBox
            containerStyle={styles.checkBoxes.checkBox}
            size={24}
            checked={answer.caretakerType === 1}
            onPress={() =>
              updateAnswer('caretakerType', answer.caretakerType === 1 ? -1 : 1)
            }
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#939393'}
            checkedColor={'#6395E1'}
          />
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.blueButton}>
        <Button
          disabled={!canGoNext}
          title={'다음'}
          titleStyle={styles.submitButton.titleStyle}
          containerStyle={styles.submitButton.containerStyle}
          buttonStyle={globalStyle.backgroundBlue}
          onPress={onSubmit}
        />
      </View>
    );
  };

  const onSubmit = () => {
    const petDetails = {
      profilePic: profilePic,
      name: petName,
      birthday: birthdayString,
      deathDay: deathDayString,
      ownerSinceBirth: answer.ownerSinceBirth, // 0 - 예, 1 - 아니오
      ownershipPeriodInMonths:
        answer.ownerSinceBirth === 0
          ? getMonthsElapsed(birthdayString)
          : years * 12 + months,
      caretakerType: answer.caretakerType,
    };
    dispatch(setNewPetGeneralInfo(petDetails));
    navigation.navigate('AddNewPet2');
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      {renderProfilePicField()}
      <View style={styles.inputFieldsContainer}>
        {renderNameField()}
        {renderBirthdayField()}
        {renderDeathDayField()}
        {renderPetOwnershipField()}
        {renderCaretakerField()}
        <Text style={styles.instruction}>
          *사진을 제외한 모든 항목은 필수 기입 항목입니다.
        </Text>
        {renderNextButton()}
      </View>
      <SinglePictureBottomSheetModal
        type={'createPet'}
        bottomSheetModalRef={bottomSheetModalRef}
        setPicture={setProfilePic}
        setPictureUrl={''}
      />
    </KeyboardAwareScrollView>
  );
};

export default AddNewPet;

const styles = StyleSheet.create({
  spacer: {padding: 20},
  profilePicAndButtonWrapper: {
    width: 130,
    height: 130,
    alignSelf: 'center',
  },
  containerForInput: {
    marginBottom: Dimensions.get('window').height * 0.025,
  },
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  profilePic: {width: '100%', height: '100%', borderRadius: 120 / 2},
  addProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  inputFieldsContainer: {
    width: '90%',
    marginVertical: 18,
    alignSelf: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 20,
    color: '#000',
  },
  textInput: {
    color: '#000',
    borderColor: '#939393',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 0.8,
    padding: 6,
    fontSize: scaleFontSize(18),
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  datePlaceholder: {
    fontSize: scaleFontSize(18),
    color: '#939393',
    textAlign: 'center',
  },
  bottomSheet: {
    inner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    icons: {
      width: 80,
      height: 80,
      alignItems: 'center',
    },
  },
  hideBottomSheetHandle: {
    height: 0,
  },
  checkBoxes: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    width: '50%',
    text: {
      fontSize: scaleFontSize(18),
      color: '#000',
      marginRight: 10,
    },
    checkBox: {
      padding: 0,
      marginRight: -4,
      marginLeft: 0,
      marginVertical: 0,
    },
  },
  yearMonthFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    zIndex: 100,
    paddingTop: Dimensions.get('window').height * 0.025,
  },
  blueButton: {
    marginVertical: Dimensions.get('window').height * 0.05,
    alignSelf: 'center',
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
  instruction: {
    color: '#939393',
    fontSize: scaleFontSize(14),
    paddingTop: Dimensions.get('window').height * 0.01,
    zIndex: 0,
  },
});
