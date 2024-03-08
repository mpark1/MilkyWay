import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {ButtonGroup} from '@rneui/themed';
import {scaleFontSize} from '../../assets/styles/scaling';

const ButtonGroups = ({setValue, questionNum, updateFunc}) => {
  return (
    <View style={styles.buttonContainer}>
      <ButtonGroup
        buttons={['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다']}
        selectedIndex={setValue}
        onPress={newValue => updateFunc(questionNum, newValue)}
        containerStyle={styles.containerStyleSet}
        selectedButtonStyle={styles.selectedButton}
        textStyle={styles.buttonText}
      />
    </View>
  );
};

export default ButtonGroups;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingTop: 5,
    flex: 1,
  },
  containerStyleSet: {
    borderRadius: 10,
  },
  selectedButton: {backgroundColor: '#939393'},
  buttonText: {
    fontSize: scaleFontSize(14),
    color: '#000',
  },
});
