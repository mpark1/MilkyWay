import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import {Slider} from '@rneui/themed';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ServiceQuestionComponent = ({
  type,
  updateFunc,
  questionNum,
  lowerbound,
  upperbound,
}) => {
  const qualitativeDescription = () => {
    return (
      <View style={styles.descriptionContainer}>
        <Text style={styles.lowerboundStyle}>전혀 도움되지 않는다</Text>
        <Text style={styles.upperboundStyle}>많은 도움이 된다</Text>
      </View>
    );
  };

  // const quantitativeDescription = () => {
  //   return (
  //     <View style={styles.descriptionContainer}>
  //       <Text style={styles.lowerboundStyle}>{lowerbound}만원</Text>
  //       <Text style={styles.upperboundStyle}>{upperbound}만원</Text>
  //     </View>
  //   );
  // };

  return (
    <View style={styles.sliderStyle}>
      {/*<Slider*/}
      {/*  value={1}*/}
      {/*  onValueChange={newValue => updateFunc(questionNum, newValue)}*/}
      {/*  maximumValue={upperbound ? upperbound : 10}*/}
      {/*  minimumValue={lowerbound ? lowerbound : 1}*/}
      {/*  step={1}*/}
      {/*  disabled={disabled}*/}
      {/*  allowTouchTrack*/}
      {/*  maximumTrackTintColor="#D9D9D9"*/}
      {/*  minimumTrackTintColor="#6395E1"*/}
      {/*  trackStyle={{*/}
      {/*    height: 5,*/}
      {/*    width: Dimensions.get('window').width * 0.75,*/}
      {/*    backgroundColor: 'transparent',*/}
      {/*  }}*/}
      {/*  thumbStyle={{height: 15, width: 15, backgroundColor: 'transparent'}}*/}
      {/*  thumbProps={{*/}
      {/*    children: (*/}
      {/*      <FontAwesome*/}
      {/*        name="circle"*/}
      {/*        size={15}*/}
      {/*        reverse*/}
      {/*        containerStyle={{bottom: 10, right: 10}}*/}
      {/*        color="#6395E1"*/}
      {/*      />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*{type === 'qualitative'*/}
      {/*  ? qualitativeDescription()*/}
      {/*  : quantitativeDescription()}*/}
    </View>
  );
};

export default ServiceQuestionComponent;

const styles = StyleSheet.create({
  sliderStyle: {
    width: Dimensions.get('window').width * 0.75,
  },
  lowerboundStyle: {
    fontSize: scaleFontSize(16),
  },
  upperboundStyle: {
    fontSize: scaleFontSize(16),
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width * 0.75,
  },
});
