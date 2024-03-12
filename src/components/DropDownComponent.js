import React from 'react';
import {StyleSheet} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDownComponent = ({
  items,
  setValue,
  value,
  open,
  zIndex,
  setOpen,
  whichPage,
  placeholderText,
}) => {
  const selectStyles = () => {
    if (whichPage === 'TesteeInfo') {
      return {
        containerStyle: styles.testeeInfo.containerStyle,
        borderStyle: styles.testeeInfo.borderStyle,
        textStyle: styles.testeeInfo.textStyle,
        placeholderStyle: styles.testeeInfo.placeholder,
      };
    } else if (whichPage === 'ServiceQuestions') {
      return {
        containerStyle: styles.serviceQuestions.containerStyle,
        borderStyle: styles.serviceQuestions.borderStyle,
        textStyle: styles.serviceQuestions.textStyle,
        placeholderStyle: styles.serviceQuestions.placeholder,
      };
    } else {
      return {
        containerStyle: styles.addNewPet.containerStyle,
        borderStyle: styles.addNewPet.borderStyle,
        textStyle: styles.addNewPet.textStyle,
        placeholderStyle: styles.addNewPet.placeholder,
      };
    }
  };

  const {containerStyle, borderStyle, textStyle, placeholderStyle} =
    selectStyles();

  return (
    <DropDownPicker
      containerStyle={containerStyle}
      style={borderStyle}
      dropDownContainerStyle={borderStyle}
      textStyle={textStyle}
      multiple={false}
      placeholderStyle={placeholderStyle}
      items={items}
      placeholder={placeholderText}
      setValue={setValue}
      value={value}
      open={open}
      setOpen={setOpen}
      zIndex={zIndex}
      listMode="SCROLLVIEW"
      dropDownDirection={'BOTTOM'}
    />
  );
};

export default DropDownComponent;

const styles = StyleSheet.create({
  testeeInfo: {
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
    textStyle: {fontSize: scaleFontSize(18)},
  },
  serviceQuestions: {
    containerStyle: {},
    borderStyle: {},
    placeholder: {},
    textStyle: {},
  },
  addNewPet: {
    containerStyle: {
      width: '31%',
      maxHeight: 30,
      backgroundColor: '#fff',
    },
    borderStyle: {
      borderBottomWidth: 1,
      borderColor: '#d9d9d9',
      minHeight: 30,
      fontSize: scaleFontSize(18),
    },
    placeholder: {color: '#939393', fontSize: scaleFontSize(16)},
    textStyle: {fontSize: scaleFontSize(18)},
  },
});
