import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';

const BlueButton = ({containerStyle, title, titleStyle, onPress}) => {
  return (
    <Button
      title={title}
      titleStyle={styles.defaultTitleStyle}
      containerStyle={styles.defaultContainerStyle}
      buttonStyle={styles.buttonColor}
      onPress={onPress}
    />
  );
};

export default BlueButton;

const styles = StyleSheet.create({
  buttonColor: {
    backgroundColor: '#6395E1',
  },
  defaultTitleStyle: {
    fontSize: scaleFontSize(16),
    color: '#FFF',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 25,
    // width: 116,
  },
  defaultContainerStyle: {
    borderRadius: 10,
  },
});
