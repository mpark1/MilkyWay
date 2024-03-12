import React, {useState, useEffect} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Tooltip} from '@rneui/themed';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

import BlueButton from '../../../components/Buttons/BlueButton';
import PBQTestQuestion from '../../../components/PBQTestQuestion';

import questionnaire from '../../../data/PBQ.json';
import {
  mutationItemNoAlertBox,
  querySingleItem,
} from '../../../utils/amplifyUtil';
import {createTest, updateTest, updateUser} from '../../../graphql/mutations';
import {useSelector} from 'react-redux';
import {getPsychologicalTest} from '../../../graphql/queries';

const PBQ = ({navigation}) => {
  const cognitoUsername = useSelector(state => state.user.cognitoUsername);
  const [answers, setAnswers] = useState({});
  const canGoNext = Object.keys(answers).length === 16;
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const [numOfTests, setNumOfTests] = useState(0);

  // 1. first, check if this person took the test before. If null, first time.
  useEffect(() => {
    const retrievePBQ = async () => {
      await querySingleItem(getPsychologicalTest, {id: cognitoUsername}).then(
        data => {
          console.log('print single obj', data.getPsychologicalTest);
          data.getPsychologicalTest !== null &&
            setNumOfTests(data.getPsychologicalTest.numOfTimes);
        },
      );
    };
    retrievePBQ();
  }, [cognitoUsername]);

  const handleSetAnswer = (id, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  const onSubmit = async () => {
    // 1. 점수 계산
    let griefScore = Object.keys(answers)
      .filter(key => key >= 1 && key <= 7) // For keys 1 to 7
      .reduce((total, key) => total + answers[key], 0);

    let angerScore = Object.keys(answers)
      .filter(key => key >= 8 && key <= 12) // For keys 8 to 12
      .reduce((total, key) => total + answers[key], 0);

    let guiltScore = Object.keys(answers)
      .filter(key => key >= 13 && key <= 16) // For keys 13 to 16
      .reduce((total, key) => total + answers[key], 0);

    const totalScore = griefScore + angerScore + guiltScore;
    griefScore = parseFloat((griefScore / 21).toFixed(2));
    angerScore = parseFloat((angerScore / 15).toFixed(2));
    guiltScore = parseFloat((guiltScore / 12).toFixed(2));

    console.log(`grief: ${griefScore}`);
    console.log(`anger: ${angerScore}`);
    console.log(`guilt: ${guiltScore}`);

    // 2. db에 결과 업로드
    const inputObj = {
      id: cognitoUsername,
      totalScore: totalScore,
      griefScore: griefScore,
      angerScore: angerScore,
      guiltScore: guiltScore,
      numOfTimes: numOfTests === 0 ? 1 : numOfTests + 1,
    };
    if (numOfTests === 0) {
      await mutationItemNoAlertBox(
        isCallingAPI,
        setIsCallingAPI,
        inputObj,
        createTest,
      );
    } else {
      await mutationItemNoAlertBox(
        isCallingAPI,
        setIsCallingAPI,
        inputObj,
        updateTest,
      );
    }
    // 3. navigation
    navigation.navigate('TestResult', {
      totalScore: totalScore,
      griefScore: griefScore,
      angerScore: angerScore,
      guiltScore: guiltScore,
      whichPAge: 'PBQTest',
    });
  };

  const [showCitation, setShowCitation] = React.useState(false);

  const renderInstruction = () => {
    return (
      <View>
        <Text style={styles.instruction}>
          총 16개의 질문으로 이루어진 마음상태 검사입니다. 해당하는 답변을
          선택해주세요.{'  '}
          <Tooltip
            visible={showCitation}
            onOpen={() => setShowCitation(true)}
            onClose={() => setShowCitation(false)}
            height={45}
            width={Dimensions.get('window').width * 0.8}
            containerStyle={styles.tooltip.container}
            popover={
              <Text style={styles.tooltip.text}>
                Hunt, M.; Padilla, Y. Development of the Pet Bereavement
                Questionnaire. Anthrozoös 2006
              </Text>
            }>
            <Text style={styles.citation}>[출처]</Text>
          </Tooltip>
        </Text>
      </View>
    );
  };

  const renderQuestions = () => {
    return (
      <View style={styles.questionnaire}>
        {questionnaire.map(question => (
          <PBQTestQuestion
            key={question.id}
            id={question.id}
            question={question.question}
            setAnswer={value => handleSetAnswer(question.id, value)}
          />
        ))}
      </View>
    );
  };

  const renderSubmitButton = () => {
    return (
      <View style={styles.nextButtonContainer}>
        <BlueButton
          onPress={onSubmit}
          // onPress={() => navigation.navigate('TestResult')}
          disabled={!canGoNext}
          title={'결과보기'}
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      {renderInstruction()}
      {renderQuestions()}
      {renderSubmitButton()}
    </ScrollView>
  );
};

export default PBQ;

const styles = StyleSheet.create({
  spacer: {
    paddingTop: Dimensions.get('window').height * 0.01,
    paddingHorizontal: Dimensions.get('window').width * 0.04,
  },
  instruction: {
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    color: '#374957',
    marginBottom: Dimensions.get('window').height * 0.01,
  },
  questionnaire: {
    marginTop: Dimensions.get('window').height * 0.02,
  },
  nextButtonContainer: {
    width: Dimensions.get('window').width * 0.4,
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.01,
    marginBottom: Dimensions.get('window').height * 0.1,
  },
  citation: {
    color: '#939393',
    fontSize: scaleFontSize(16),
  },
  tooltip: {
    container: {
      marginLeft: Dimensions.get('window').width * 0.15,
      paddingHorizontal: 5,
      paddingVertical: 0,
      alignItems: 'center',
    },
    text: {
      color: '#fff',
      fontSize: scaleFontSize(14),
    },
  },
});
