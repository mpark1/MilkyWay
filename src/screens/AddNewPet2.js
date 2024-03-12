import {Text, TextInput, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {scaleFontSize} from '../assets/styles/scaling';
import React from 'react';

const AddNewPet2 = ({navigation}) => {
  const renderLastWordField = () => {
    return (
      <View>
        <Text style={styles.label}>멀리 떠나는 아이에게 전하는 인사말</Text>
        <TextInput
          style={styles.lastWord}
          placeholder={'예: 천사같은 아이, 편히 잠들기를 (25자이내)'}
          autoCorrect={false}
          placeholderTextColor={'#d9d9d9'}
          maxLength={25}
          onChangeText={text => setLastWord(text)}
        />
      </View>
    );
  };
  const renderPetTypeField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.animalType}>
          <Text style={styles.label}>동물종류*</Text>
          <DropDownPicker
            containerStyle={styles.dropDownPicker.containerStyle}
            style={styles.dropDownPicker.borderStyle}
            dropDownContainerStyle={styles.dropDownPicker.borderStyle}
            textStyle={{fontSize: scaleFontSize(18)}}
            multiple={false}
            placeholderStyle={styles.dropDownPicker.placeholder}
            items={petOptions}
            placeholder={'선택'}
            setValue={setValue}
            value={value}
            open={open}
            setOpen={setOpen}
            zIndex={3000}
            listMode="SCROLLVIEW"
          />
        </View>
      </View>
    );
  };

  const renderDeathCausesField = () => {
    return (
      <View style={styles.containerForInput2}>
        <View style={styles.animalType}>
          <Text style={styles.label}>별이된 이유*</Text>
          <DropDownPicker
            containerStyle={styles.dropDownPicker.containerStyle}
            style={styles.dropDownPicker.borderStyle}
            dropDownContainerStyle={styles.dropDownPicker.borderStyle}
            textStyle={{fontSize: scaleFontSize(18)}}
            multiple={false}
            placeholderStyle={styles.dropDownPicker.placeholder}
            items={deathOptions}
            placeholder={'별이된 이유를 알려주세요'}
            setValue={setValue2}
            value={value2}
            open={open2}
            setOpen={setOpen2}
            zIndex={1000}
            listMode="SCROLLVIEW"
            dropDownDirection="BOTTOM"
          />
        </View>
      </View>
    );
  };
};
