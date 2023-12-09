import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Button} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DashedBorderButton = ({title, onPress, circleSize, type, titleColor}) => {
  const plusButton = (
    <View style={styles.plusButtonContainer}>
      <AntDesign name={'pluscircle'} size={circleSize} color={'#6395E1'} />
    </View>
  );

  return (
    <Button
      title={title}
      titleStyle={
        titleColor === 'white' ? styles.whiteTitleStyle : styles.grayTitleStyle
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

export default DashedBorderButton;

const styles = StyleSheet.create({
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
  buttonColor: {
    backgroundColor: 'transparent',
  },
  whiteTitleStyle: {fontWeight: 'bold', fontSize: scaleFontSize(18)},
  grayTitleStyle: {
    fontSize: scaleFontSize(20),
    color: '#939393',
  },
  regularContainerStyle: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#939393',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,
  },
  thinContainerStyle: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#939393',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
