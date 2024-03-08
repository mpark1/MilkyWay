import React, {useCallback, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

import BlueButton from '../../../components/Buttons/BlueButton';
import PBQTestQuestion from '../../../components/PBQTestQuestion';

import questionnaire from '../../../data/PBQ.json';

const PBQ = ({navigation}) => {
  const [answers, setAnswers] = useState({});
  console.log(answers);
  const canGoNext = Object.keys(answers).length === 16;

  const handleSetAnswer = (id, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  const calculateScore = (start, end) => {
    return Object.keys(answers)
      .filter(key => key >= start && key <= end)
      .reduce((total, key) => total + answers[key], 0);
  };

  const onSubmit = () => {
    const griefScore = calculateScore(1, 5);
    const angerScore = calculateScore(6, 12);
    const guiltScore = calculateScore(13, 16);

    console.log(
      `grief: ${griefScore}, anger: ${angerScore}, guilt: ${guiltScore}`,
    );

    // 2. db에 결과 업로드

    // 3. navigation - props?
  };

  const renderInstruction = () => {
    return (
      <Text style={styles.instruction}>
        총 16개의 질문으로 이루어진 마음상태 검사입니다. 해당하는 답변을
        선택해주세요.
      </Text>
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

  const renderSubmitButton = useCallback(() => {
    return (
      <View style={styles.nextButtonContainer}>
        <BlueButton
          onPress={onSubmit}
          disabled={!canGoNext}
          title={'결과보기'}
        />
      </View>
    );
  }, [canGoNext]);

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
});
