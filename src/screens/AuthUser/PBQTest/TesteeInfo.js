import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {CheckBox} from '@rneui/themed';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

import PetTypes from '../../../data/PetTypes.json';
import deathCauses from '../../../data/deathCauses.json';
import BlueButton from '../../../components/Buttons/BlueButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const TesteeInfo = ({navigation}) => {
  const [gender, setGender] = useState(-1);
  const [age, setAge] = useState('');

  const [singleCaretaker, setSingleCaretaker] = useState(false); // 1인 보호자 / 가족 단위 보호자
  const [familyCaretaker, setFamilyCaretaker] = useState(false);

  const toggleFemale = () => setGender(gender === 0 ? -1 : 0);
  const toggleMale = () => setGender(gender === 1 ? -1 : 1);
  const toggleSingleCaretaker = () => setSingleCaretaker(!singleCaretaker);
  const toggleFamilyCaretaker = () => setFamilyCaretaker(!familyCaretaker);

  const [petOwnershipPeriod, setPetOwnershipPeriod] = useState({
    year: '',
    month: '',
  }); // 양육 기간

  const [petType, setPetType] = useState('');
  const petOptions = Object.keys(PetTypes).map(key => ({
    label: key,
    value: key,
  }));
  const [deathCause, setDeathCause] = useState(null);
  const deathOptions = deathCauses.map(item => ({
    label: item,
    value: item,
  }));

  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [deathCausePickerOpen, setDeathCausePickerOpen] = useState(false);

  const [ageOfDeath, setAgeOfDeath] = useState('');
  const [timePassed, setTimePassed] = useState('');
  const [pastExperience, setPastExperience] = useState(null);

  const canGoNext = false;

  const renderInstruction = () => {
    return (
      <Text style={styles.instruction}>심리 테스트 전 질문 몇개만 할게요.</Text>
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
            checked={gender === 0}
            onPress={toggleFemale}
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
            checked={gender === 1}
            onPress={toggleMale}
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

  const renderAgeField = () => {
    return (
      <View
        style={[
          styles.fieldContainer,
          {marginBottom: Dimensions.get('window').height * 0.02},
        ]}>
        <Text style={styles.text}>2. 나이</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.textInput}
            clearButtonMode={'while-editing'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={setAge}
            value={age}
            keyboardType={'numeric'}
          />
          <Text style={[styles.text]}>{'  '}세</Text>
        </View>
      </View>
    );
  };

  const renderSubInstruction = () => {
    return (
      <Text style={[styles.instruction, {fontSize: scaleFontSize(16)}]}>
        *3-8번은 가장 최근에 별이된 아이에 관한 질문입니다.
      </Text>
    );
  };

  const renderCaretakerField = () => {
    return (
      <View style={styles.fieldContainer}>
        <View style={{alignSelf: 'flex-start', flexDirection: 'row'}}>
          <Text style={[styles.text, {marginRight: 10}]}>3. 1인 보호자</Text>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={singleCaretaker}
            onPress={toggleSingleCaretaker}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.text, {marginRight: 10}]}>가족 단위 보호자</Text>
          <CheckBox
            containerStyle={[styles.checkBox]}
            size={24}
            checked={familyCaretaker}
            onPress={toggleFamilyCaretaker}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
        </View>
      </View>
    );
  };

  const renderPetOwnershipField = () => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.text}>4. 양육 기간</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.textInput}
            clearButtonMode={'while-editing'}
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={'numeric'}
            onChangeText={year => {
              setPetOwnershipPeriod(prev => ({...prev, year: year}));
            }}
            value={petOwnershipPeriod.year}
          />
          <Text style={styles.text}>
            {'  '}년{'   '}{' '}
          </Text>
          <TextInput
            style={styles.textInput}
            clearButtonMode={'while-editing'}
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={'numeric'}
            onChangeText={month => {
              setPetOwnershipPeriod(prev => ({...prev, month: month}));
            }}
            value={petOwnershipPeriod.month}
          />
          <Text style={[styles.text]}>{'  '}개월</Text>
        </View>
      </View>
    );
  };

  const renderPetTypeField = () => {
    return (
      <View style={[styles.fieldContainer, {alignItems: 'center', zIndex: 5}]}>
        <Text style={styles.text}>5. 동물종류</Text>
        <DropDownPicker
          containerStyle={styles.dropDownPicker.containerStyle}
          style={styles.dropDownPicker.borderStyle}
          dropDownContainerStyle={styles.dropDownPicker.borderStyle}
          textStyle={{fontSize: scaleFontSize(18)}}
          multiple={false}
          placeholderStyle={styles.dropDownPicker.placeholder}
          items={petOptions}
          placeholder={'선택'}
          setValue={setPetType}
          value={petType}
          open={typePickerOpen}
          setOpen={setTypePickerOpen}
          zIndex={4}
          listMode="SCROLLVIEW"
        />
      </View>
    );
  };

  const renderDeathCauseField = () => {
    return (
      <View style={[styles.fieldContainer, {alignItems: 'center', zIndex: 3}]}>
        <Text style={styles.text}>6. 죽음의 원인</Text>
        <DropDownPicker
          containerStyle={styles.dropDownPicker.containerStyle}
          style={styles.dropDownPicker.borderStyle}
          dropDownContainerStyle={styles.dropDownPicker.borderStyle}
          textStyle={{fontSize: scaleFontSize(18)}}
          multiple={false}
          placeholderStyle={styles.dropDownPicker.placeholder}
          items={deathOptions}
          placeholder={'선택'}
          setValue={setDeathCause}
          value={deathCause}
          open={deathCausePickerOpen}
          setOpen={setDeathCausePickerOpen}
          zIndex={2}
          listMode="SCROLLVIEW"
          dropDownDirection="BOTTOM"
        />
      </View>
    );
  };

  const renderAgeOfDeathField = () => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.text}>7. 아이가 죽었을 때 나이</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.textInput}
            clearButtonMode={'while-editing'}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={ageOfDeath}
            onChangeText={setAgeOfDeath}
            keyboardType={'numeric'}
          />
          <Text style={[styles.text]}>{'  '}살</Text>
        </View>
      </View>
    );
  };

  const renderTimePassedField = () => {
    return (
      <View
        style={[
          styles.fieldContainer,
          {
            flexDirection: 'column',
            marginBottom: Dimensions.get('window').height * 0.01,
          },
        ]}>
        <Text style={styles.text}>8. 아이가 떠난지 얼마나 됐나요?</Text>
        <View
          style={{flexDirection: 'row', alignSelf: 'flex-end', marginTop: 20}}>
          <TextInput
            style={styles.textInput}
            clearButtonMode={'while-editing'}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={timePassed}
            onChangeText={setTimePassed}
            keyboardType={'numeric'}
          />
          <Text style={[styles.text]}>{'  '}개월 미만</Text>
        </View>
      </View>
    );
  };

  const renderPastExperienceField = () => {
    return (
      <View style={[styles.fieldContainer, {flexDirection: 'column'}]}>
        <Text style={styles.text}>
          9. 이전에도 애완동물의 죽음을 경험한 적이 있나요?
        </Text>
        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={pastExperience === true}
            onPress={() =>
              setPastExperience(pastExperience === true ? null : true)
            } // Toggle between true and null
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={[styles.text, {marginLeft: 10, marginRight: 20}]}>
            있다
          </Text>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={pastExperience === false}
            onPress={() =>
              setPastExperience(pastExperience === false ? null : false)
            }
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={[styles.text, {marginLeft: 10}]}>없다</Text>
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.nextButtonContainer}>
        <BlueButton
          disabled={false}
          title={'테스트 시작'}
          onPress={() => navigation.navigate('PBQTestQuestions')}
        />
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      {renderInstruction()}
      <View style={styles.spacer}>
        {renderGenderField()}
        {renderAgeField()}
      </View>
      {renderSubInstruction()}
      <View style={styles.threeToNineContainer}>
        <View style={styles.greyBackground}>
          <View style={styles.greyBackgroundSpacer}>
            {renderCaretakerField()}
            {renderPetOwnershipField()}
            {renderPetTypeField()}
            {renderDeathCauseField()}
            {renderAgeOfDeathField()}
            {renderTimePassedField()}
          </View>
        </View>
        <View style={styles.greyBackgroundSpacer}>
          {renderPastExperienceField()}
          {renderNextButton()}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default TesteeInfo;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.08,
    paddingTop: Dimensions.get('window').height * 0.01,
  },
  threeToNineContainer: {
    paddingTop: Dimensions.get('window').height * 0.005,
    paddingHorizontal: Dimensions.get('window').width * 0.04,
  },
  greyBackground: {
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
  },
  greyBackgroundSpacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.02,
    paddingTop: Dimensions.get('window').height * 0.01,
  },
  instruction: {
    marginTop: Dimensions.get('window').height * 0.01,
    paddingHorizontal: Dimensions.get('window').width * 0.04,
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    color: '#374957',
    marginBottom: Dimensions.get('window').height * 0.01,
  },
  fieldContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: Dimensions.get('window').height * 0.04,
    width: '100%',
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
  textInput: {
    width: 50,
    height: 24,
    borderBottomWidth: 1,
    borderColor: '#374957',
    fontSize: scaleFontSize(18),
    textAlign: 'center',
  },
  dropDownPicker: {
    containerStyle: {
      width: '50%',
      maxHeight: 37,
      backgroundColor: '#fff',
    },
    borderStyle: {
      borderRadius: 5,
      borderColor: '#d9d9d9',
      minHeight: 40,
      padding: 8,
      fontSize: scaleFontSize(18),
    },
    placeholder: {color: '#939393', fontSize: scaleFontSize(16)},
  },
  nextButtonContainer: {
    width: Dimensions.get('window').width * 0.4,
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.01,
    marginBottom: Dimensions.get('window').height * 0.1,
  },
});
