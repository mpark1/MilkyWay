import React, {useCallback, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

import BlueButton from '../../../components/Buttons/BlueButton';
import PBQTestQuestion from '../../../components/PBQTestQuestion';

import questionnaire from '../../../data/PBQ.json';

const PBQ = ({navigation}) => {
  const [answers, setAnswers] = useState({}); // maintain state of answers
  console.log(answers);
  const canGoNext = Object.keys(answers).length === 16;

  const handleSetAnswer = (id, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  const onSubmit = () => {
    // 1. Grief, Anger, Guilt 점수 계산
    const griefScore = Object.keys(answers)
      .filter(key => key >= 1 && key <= 5) // For keys 1 to 7
      .reduce((total, key) => total + answers[key], 0);

    const angerScore = Object.keys(answers)
      .filter(key => key >= 6 && key <= 12) // For keys 8 to 14
      .reduce((total, key) => total + answers[key], 0);

    const guiltScore = Object.keys(answers)
      .filter(key => key >= 15 && key <= 16) // For keys 15 to 16
      .reduce((total, key) => total + answers[key], 0);

    console.log(`Grief: ${griefScore}`);
    console.log(`Anger: ${angerScore}`);
    console.log(`Guilt: ${guiltScore}`);

    // 2. db에 결과 업로드?

    // 3. navigation
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
