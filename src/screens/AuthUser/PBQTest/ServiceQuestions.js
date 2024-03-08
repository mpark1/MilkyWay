import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import {scaleFontSize} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import ServiceQuestionComponent from '../../../components/ServiceQuestionComponent';
import {CheckBox} from '@rneui/themed';
import BlueButton from '../../../components/Buttons/BlueButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ButtonGroups from '../../../components/Buttons/ButtonGroups';

// check slider - it exceeds the max value, why???
const ServiceQuestions = ({navigation}) => {
  const [questionnaire, setQuestionnaire] = useState({
    1: 2,
    2: 2,
    3: 0,
    '3boxChecked': false,
    4: 0,
    '4boxChecked': false,
    5: 0,
    '5boxChecked': false,
    6: 0,
    '6boxChecked': false,
    '7bookChecked': false,
    '7goodsChecked': false,
    '7otherGoods': '',
    8: '',
  });
  console.log(questionnaire);

  const updateAnswer = (questionNum, newValue) =>
    setQuestionnaire(prev => ({
      ...prev,
      [questionNum]: newValue,
    }));

  const firstQuestions = (questionNum, question, componentType) => {
    return (
      <View style={styles.oneQuestion}>
        <Text style={styles.textStyle}>{question}</Text>
        <ButtonGroups
          questionNum={questionNum}
          updateFunc={updateAnswer}
          setValue={questionnaire[questionNum]}
        />
      </View>
    );
  };

  const secondQuestions = (
    questionNum,
    boxNum,
    question,
    description,
    componentType,
    lowerbound,
    upperbound,
  ) => {
    return (
      <View style={styles.oneQuestion}>
        <View style={styles.alignQuestionAndBox}>
          <Text style={styles.textStyle}>{question}</Text>
          <View style={styles.alignBoxComment}>
            <CheckBox
              containerStyle={styles.checkBox}
              size={20}
              checked={questionnaire[boxNum]}
              onPress={() => updateAnswer(boxNum, !questionnaire[boxNum])}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              uncheckedColor={'#374957'}
              checkedColor={'#6395E1'}
            />
            <Text style={styles.checkboxText}>관심없음</Text>
          </View>
        </View>
        <Text style={styles.textDescription}>{description}</Text>
      </View>
    );
  };

  const thirdQuestions = () => {
    return (
      <View style={styles.oneQuestion}>
        <Text style={styles.textStyle}>
          7. 아래에서 관심있는 서비스를 선택해주세요.
        </Text>
        <View style={styles.alignCommentAndBox}>
          <Text style={styles.textStyle}> - 반려동물이 주인공인 책 만들기</Text>
          <CheckBox
            containerStyle={styles.checkBox}
            size={22}
            checked={questionnaire['7bookChecked']}
            onPress={() =>
              updateAnswer('7bookChecked', !questionnaire['7bookChecked'])
            }
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
        </View>
        <View style={styles.alignCommentAndBox}>
          <Text style={styles.textStyle}>
            {' '}
            - 추모 굿즈 만들기 (컵, 액자 등)
          </Text>
          <CheckBox
            containerStyle={styles.checkBox}
            size={22}
            checked={questionnaire['7goodsChecked']}
            onPress={() =>
              updateAnswer('7goodsChecked', !questionnaire['7goodsChecked'])
            }
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
        </View>
        <View style={styles.textInputWrapper}>
          <Text style={styles.textStyle}>원하는 굿즈</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'직접입력'}
            placeholderTextColor={'#939393'}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={questionnaire['7otherGoods']}
            onChangeText={() =>
              updateAnswer('7otherGoods', !questionnaire['7otherGoods'])
            }
          />
        </View>
      </View>
    );
  };

  const fourthQuestion = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.textStyle}>8. 기타 원하는 서비스</Text>
        <TextInput
          style={styles.textInput}
          placeholder={'직접입력'}
          placeholderTextColor={'#939393'}
          autoCapitalize={'none'}
          autoCorrect={false}
          value={questionnaire[8]}
          onChangeText={() => updateAnswer(8, !questionnaire[8])}
        />
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        <Text style={styles.textStyle}>
          반려동물을 잃은 슬픔을 극복하는데 본인에게 도움이 되는 서비스를
          알려주세요!
        </Text>
        <View style={styles.questionnaire}>
          {firstQuestions(
            1,
            '1. 은하수가 제공하는 온라인 추모공간 (내 추모공간)이 슬픔을 극복하는데 도움이 된다.',
            'qualitative',
          )}
          {firstQuestions(
            2,
            '2. 은하수 커뮤니티에서 사람들과 소통하는 것이 도움이 된다.',
            'qualitative',
          )}
          <Text style={styles.litteText}>
            *3-6번: 본인이 최대로 지불할 금액을 선택해 주세요.
          </Text>
          {secondQuestions(
            3,
            '3boxChecked',
            '3. 개인(1:1) 온라인 심리상담 ',
            '적정비용 (1회 50분)',
            'quantitative',
            6,
            10,
          )}
          {secondQuestions(
            4,
            '4boxChecked',
            '4. 그룹 온라인 심리상담',
            '적정비용 (1회 90분, 4명 이하)',
            'quantitative',
            6,
            10,
          )}
          {secondQuestions(
            5,
            '5boxChecked',
            '5. 개인(1:1) 오프라인 심리상담',
            '적정비용 (1회 50분)',
            'quantitative',
            7,
            15,
          )}
          {secondQuestions(
            6,
            '6boxChecked',
            '6. 그룹 오프라인 심리상담',
            '적정비용 (1회 90분, 4명 이하)',
            'quantitative',
            6,
            12,
          )}
          {thirdQuestions()}
          {fourthQuestion()}
          <View style={styles.blueButton}>
            <BlueButton
              title={'메인 화면으로'}
              onPress={() => navigation.navigate('')}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ServiceQuestions;

const styles = StyleSheet.create({
  spacer: {
    width: '90%',
    paddingTop: Dimensions.get('window').height * 0.01,
    alignSelf: 'center',
    // alignItems: 'flex-start',
  },
  oneQuestion: {
    marginVertical: 10,
  },
  alignQuestionAndBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alignBoxComment: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },
  alignCommentAndBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    // paddingTop: 5,
  },
  textStyle: {
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
  },
  litteText: {
    fontSize: scaleFontSize(16),
    paddingTop: 5,
    color: '#939393',
  },
  checkboxText: {
    fontSize: scaleFontSize(18),
    marginHorizontal: 5,
  },
  textDescription: {
    fontSize: scaleFontSize(16),
    marginTop: 5,
    marginLeft: 10,
    color: '#373737',
  },
  textInputWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  textInput: {
    width: '50%',
    paddingVertical: 5,
    marginLeft: 10,
    paddingLeft: 10,
    color: '#000000',
    fontSize: scaleFontSize(18),
    alignSelf: 'center',
    borderBottomWidth: 1,
  },
  questionnaire: {
    paddingVertical: 10,
  },
  checkBox: {
    padding: 0,
    marginRight: 0,
    marginLeft: 0,
    marginVertical: 0,
  },
  blueButton: {
    marginVertical: Dimensions.get('window').height * 0.05,
    alignSelf: 'center',
  },
});
