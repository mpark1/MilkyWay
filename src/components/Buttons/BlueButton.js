import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from '@rneui/base';

const BlueButton = ({containerStyle, title, titleStyle, onPress}) => {
  return (
    <Button
      title={title}
      titleStyle={titleStyle}
      containerStyle={containerStyle}
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
});
