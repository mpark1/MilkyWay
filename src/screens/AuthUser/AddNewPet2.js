import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {setNewPetGeneralInfo2} from '../../redux/slices/NewPet';
import PetTypes from '../../data/PetTypes.json';
import PetBreeds from '../../data/breeds.json';
import deathCauses from '../../data/deathCauses.json';
import DropDownComponent from '../../components/DropDownComponent';
import BlueButton from '../../components/Buttons/BlueButton';
import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

const AddNewPet2 = ({navigation}) => {
  const dispatch = useDispatch();
  const petOptions = Object.keys(PetTypes).map(key => ({
    label: key,
    value: key,
  }));
  const deathOptions = deathCauses.map(item => ({
    label: item,
    value: item,
  }));

  const [petType, setPetType] = useState('');
  const selectedBreeds = PetBreeds[petType] || [];
  const breedOptions = selectedBreeds.map(item => ({
    label: item,
    value: item,
  }));
  const [breed, setBreed] = useState('');
  const [deathCause, setDeathCause] = useState('');

  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [breedPickerOpen, setBreedPickerOpen] = useState(false);
  const [deathCausePickerOpen, setDeathCausePickerOpen] = useState(false);

  const [lastWord, setLastWord] = useState('');

  const canGoNext =
    petType.length > 0 && breed.length > 0 && deathCause.length > 0;

  const onSubmit = () => {
    const petDetails = {
      petType: petType,
      breed: breed,
      deathCause: deathCause,
      lastWord: lastWord,
    };
    dispatch(setNewPetGeneralInfo2(petDetails));
    navigation.navigate('SetAccessLevel');
  };

  const renderPetTypeField = () => {
    return (
      <View style={[styles.fieldContainer, {alignItems: 'center', zIndex: 10}]}>
        <Text style={styles.text}>동물종류*</Text>
        <DropDownComponent
          items={petOptions}
          value={petType}
          setValue={setPetType}
          open={typePickerOpen}
          setOpen={setTypePickerOpen}
          zIndex={10}
          whichPage={'TesteeInfo'}
          placeholderText={'선택'}
        />
      </View>
    );
  };

  const renderBreedsField = () => {
    return (
      <View style={[styles.fieldContainer, {zIndex: 9}]}>
        <Text style={styles.text}>세부종류*</Text>
        <DropDownComponent
          items={breedOptions}
          value={breed}
          setValue={setBreed}
          open={breedPickerOpen}
          setOpen={setBreedPickerOpen}
          zIndex={9}
          whichPage={'TesteeInfo'}
          placeholderText={'선택'}
        />
      </View>
    );
  };

  const renderDeathCauseField = () => {
    return (
      <View style={[styles.fieldContainer, {zIndex: 8}]}>
        <Text style={styles.text}>별이된 이유*</Text>
        <DropDownComponent
          items={deathOptions}
          value={deathCause}
          setValue={setDeathCause}
          open={deathCausePickerOpen}
          setOpen={setDeathCausePickerOpen}
          zIndex={8}
          whichPage={'TesteeInfo'}
          placeholderText={'선택'}
        />
      </View>
    );
  };

  const renderLastWordField = () => {
    return (
      <View style={{zIndex: 2}}>
        <Text style={styles.text}>멀리 떠나는 아이에게 전하는 인사말</Text>
        <TextInput
          style={styles.lastWord}
          placeholder={'예: 천사같은 아이, 편히 잠들기를 (25자이내)'}
          autoCorrect={false}
          placeholderTextColor={'#d9d9d9'}
          maxLength={25}
          onChangeText={text => setLastWord(text)}
          value={lastWord}
        />
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.nextButtonContainer}>
        <BlueButton disabled={!canGoNext} title={'다음'} onPress={onSubmit} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderPetTypeField()}
        {renderBreedsField()}
        {renderDeathCauseField()}
        {renderLastWordField()}
        <Text style={styles.instruction}>*필수기입 항목</Text>
      </View>
      {renderNextButton()}
    </SafeAreaView>
  );
};

export default AddNewPet2;

const styles = StyleSheet.create({
  spacer: {
    padding: 20,
    width: '90%',
    alignSelf: 'center',
  },
  greyBackground: {
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    zIndex: 3,
    marginBottom: Dimensions.get('window').height * 0.01,
  },
  greyBackgroundSpacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.02,
    paddingTop: Dimensions.get('window').height * 0.01,
  },
  fieldContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: Dimensions.get('window').height * 0.04,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    color: '#000',
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
  lastWord: {
    marginTop: 10,
    marginBottom: 2,
    fontSize: scaleFontSize(18),
    color: '#939393',
    borderColor: '#939393',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nextButtonContainer: {
    width: Dimensions.get('window').width * 0.4,
    alignSelf: 'center',
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.1,
  },
  instruction: {
    color: '#000',
    fontSize: scaleFontSize(14),
    marginTop: 10,
  },
});
