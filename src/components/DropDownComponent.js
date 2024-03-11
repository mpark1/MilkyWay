import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
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
}) => {
  const selectStyles = () => {
    if (whichPage === 'TesteeInfo') {
      return {
        containerStyle: styles.testeeInfo.containerStyle,
        borderStyle: styles.testeeInfo.borderStyle,
        textStyle: styles.testeeInfo.textStyle,
        placeholderStyle: styles.testeeInfo.placeholder,
      };
    } else if (whichPage === 'ServiceQuestion') {
      return {
        containerStyle: styles.serviceQuestions.containerStyle,
        borderStyle: styles.serviceQuestions.borderStyle,
        textStyle: styles.serviceQuestions.textStyle,
        placeholderStyle: styles.serviceQuestions.placeholder,
      };
    } else {
      return {
        containerStyle: styles.otherContainerStyle,
        borderStyle: styles.serviceQuestions.borderStyle,
        textStyle: styles.serviceQuestions.textStyle,
        placeholderStyle: styles.serviceQuestions.placeholder,
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
      placeholder={'선택'}
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
  otherContainerStyle: {
    width: Dimensions.get('window').height * 0.1,
  },
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
    containerStyle: {
      width: Dimensions.get('window').height * 0.18,
      maxHeight: 30,
      backgroundColor: '#fff',
    },
    borderStyle: {
      borderRadius: 5,
      borderColor: '#d9d9d9',
      minHeight: 40,
      padding: 5,
      fontSize: scaleFontSize(18),
    },
    placeholder: {color: '#939393', fontSize: scaleFontSize(16)},
    textStyle: {fontSize: scaleFontSize(18)},
  },
});
