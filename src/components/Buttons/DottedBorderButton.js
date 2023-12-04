import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Button} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DottedBorderButton = ({title, onPress, circleSize, type, titleColor}) => {
  const plusButton = (
    <View style={styles.plusButtonContainer}>
      <AntDesign name={'pluscircle'} size={circleSize} color={'#6395E1'} />
    </View>
  );

  return (
    <Button
      title={title}
      titleStyle={
        titleColor === 'white' ? styles.whiteTitleStyle : styles.blackTitleStyle
      }
      containerStyle={
        type === 'regular'
          ? styles.regularContainerStyle
          : styles.thinContainerStyle
      }
      buttonStyle={styles.buttonColor}
      onPress={onPress}
      icon={plusButton}
    />
  );
};

export default DottedBorderButton;

const styles = StyleSheet.create({
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
  buttonColor: {
    backgroundColor: 'transparent',
  },
  whiteTitleStyle: {fontWeight: 'bold', fontSize: scaleFontSize(18)},
  blackTitleStyle: {
    fontSize: scaleFontSize(18),
    color: '#939393',
  },
  regularContainerStyle: {
    width: Dimensions.get('window').width * 0.93,
    height: 90,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#939393',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: Dimensions.get('window').height * 0.05,
  },
  thinContainerStyle: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#939393',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // marginBottom: Dimensions.get('window').height * 0.05,
  },
});
