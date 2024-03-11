import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import {LinearProgress} from '@rneui/themed';

const PBQTestResult = ({title, decimal, barColor, trackColor}) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: scaleFontSize(20),
          color: barColor,
          fontWeight: 'bold',
        }}>
        {title}
        {'   '}
        {Math.trunc(decimal * 100)}
        {'%'}
      </Text>
      <View style={styles.shadowProp}>
        <LinearProgress
          style={styles.progressBar}
          value={decimal}
          color={barColor}
          trackColor={trackColor}
          variant="determinate"
        />
      </View>
    </View>
  );
};

export default PBQTestResult;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: Dimensions.get('window').width * 0.05,
    width: Dimensions.get('window').width * 0.8,
    marginVertical: 10,
  },
  progressBar: {
    marginVertical: 10,
    height: 30,
    borderRadius: 10,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
});
