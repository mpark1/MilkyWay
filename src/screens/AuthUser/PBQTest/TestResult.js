import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {scaleFontSize} from '../../../assets/styles/scaling';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import PBQTestResult from '../../../components/PBQTestResult';
import BlueButton from '../../../components/Buttons/BlueButton';
import testResultComments from '../../../data/testResultComments.json';

const TestResult = ({navigation, route}) => {
  const {totalScore, griefScore, angerScore, guiltScore} = route.params;
  console.log(totalScore, griefScore, angerScore, guiltScore);

  const testResultDescription = () => {
    let comment = '';
    const thresholds = Object.keys(testResultComments).map(Number);
    for (let i = 0; i < thresholds.length; i++) {
      if (totalScore <= thresholds[i]) {
        comment = testResultComments[thresholds[i]];
        console.log('print result comment', comment);
        break;
      }
    }
    return comment;
  };

  return (
    <ScrollView style={styles.page}>
      <View style={[styles.topContainer, styles.shadowProp]}>
        <Text style={styles.titleText}>총 {totalScore}점</Text>
        <View style={{flexDirection: 'row'}}>
          <FontAwesome6Icon
            name={'prescription-bottle-medical'}
            style={{marginVertical: 10}}
            size={22}
            color={'#000'}
          />
          <Text style={styles.prescriptionText}>
            처방 - {testResultDescription()}
          </Text>
        </View>
      </View>
      {/*<Text style={styles.dateTime}>검사일시: 2024년 5월 1일 15:00pm</Text>*/}
      <View style={styles.graphContainer}>
        <PBQTestResult
          title={'슬픔'}
          decimal={griefScore}
          barColor={'#DA6666'}
          trackColor={'#DCA1A1'}
        />
        <PBQTestResult
          title={'죄책감'}
          decimal={guiltScore}
          barColor={'#6890DF'}
          trackColor={'#94B3E0'}
        />
        <PBQTestResult
          title={'분노'}
          decimal={angerScore}
          barColor={'#59BC69'}
          trackColor={'#A5BAA8'}
        />
      </View>
      <View style={styles.blueButton}>
        <BlueButton
          title={'다음'}
          onPress={() => navigation.navigate('ServiceQuestions')}
        />
      </View>
    </ScrollView>
  );
};

export default TestResult;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: Dimensions.get('window').width * 0.08,
    backgroundColor: '#EEEEEE',
  },
  topContainer: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    height: Dimensions.get('window').height * 0.2,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  titleText: {
    alignSelf: 'center',
    fontSize: scaleFontSize(22),
    color: '#DA6666',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  prescriptionText: {
    marginVertical: 10,
    marginLeft: 7,
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    flex: 1,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  dateTime: {
    fontSize: scaleFontSize(14),
    color: '#374957',
  },
  graphContainer: {
    marginVertical: Dimensions.get('window').height * 0.04,
  },
  blueButton: {
    // marginVertical: Dimensions.get('window').height * 0.07,
    alignSelf: 'center',
  },
});
