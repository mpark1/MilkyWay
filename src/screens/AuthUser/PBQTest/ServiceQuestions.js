import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {scaleFontSize} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import {CheckBox} from '@rneui/themed';
import BlueButton from '../../../components/Buttons/BlueButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ButtonGroups from '../../../components/Buttons/ButtonGroups';
import DropDownComponent from '../../../components/DropDownComponent';
import {mutationItem, querySingleItem} from '../../../utils/amplifyUtil';
import {getServiceSurvey} from '../../../graphql/queries';
import {useSelector} from 'react-redux';
import {
  createServiceSurvey,
  updateServiceSurvey,
} from '../../../graphql/mutations';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '@rneui/base';

// check slider - it exceeds the max value, why???
const ServiceQuestions = ({navigation}) => {
  const cognitoUsername = useSelector(state => state.user.cognitoUsername);
  const [numOfSurvey, setNumOfSurvey] = useState(0);
  const [questionnaire, setQuestionnaire] = useState({
    1: 2,
    2: 2,
    '7bookChecked': false,
    '7goodsChecked': false,
    '7artTherapyChecked': false,
    '7otherGoods': '',
    8: '',
  });
  console.log(questionnaire);
  const [question3, setQuestion3] = useState(0);
  const [question4, setQuestion4] = useState(0);
  const [question5, setQuestion5] = useState(0);
  const [question6, setQuestion6] = useState(0);
  const [onlineIndividual, setOnlineIndividual] = useState(false);
  const [onlineGroup, setOnlineGroup] = useState(false);
  const [offlineIndividual, setOfflineIndividual] = useState(false);
  const [offlineGroup, setOfflineGroup] = useState(false);
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const [obj, setDbObj] = useState({});

  // 1. first, check if this person took the serviceSurvey before. If null, first time.
  useEffect(() => {
    const retrieveServiceSurvey = async () => {
      await querySingleItem(getServiceSurvey, {id: cognitoUsername}).then(
        data => {
          const obj = data.getServiceSurvey;
          console.log('print single obj', obj);
          if (obj !== null) {
            setDbObj(obj);
            setNumOfSurvey(obj.numOfSurveys);
            setQuestion3(obj.individualOnlineCounseling);
            setQuestion4(obj.groupOnlineCounseling);
            setQuestion5(obj.individualOfflineCounseling);
            setQuestion6(obj.groupOfflineCounseling);
            setQuestionnaire({
              1: obj.petSpace,
              2: obj.communitySpace,
              '7bookChecked': obj.book,
              '7goodsChecked': obj.goods,
              '7artTherapyChecked': obj.artTherapy,
              '7otherGoods': obj.goodsUserInput,
              8: obj.otherService,
            });
          }
        },
      );
    };
    retrieveServiceSurvey();
  }, [cognitoUsername]);

  let canGoNext =
    question3 !== 0 && question4 !== 0 && question5 !== 0 && question6 !== 0;

  let noChangeInResponse =
    obj.individualOnlineCounseling === question3 &&
    obj.groupOnlineCounseling === question4 &&
    obj.individualOfflineCounseling === question5 &&
    obj.groupOfflineCounseling === question6 &&
    questionnaire[1] === obj.petSpace &&
    questionnaire[2] === obj.communitySpace &&
    questionnaire['7bookChecked'] === obj.book &&
    questionnaire['7goodsChecked'] === obj.goods &&
    questionnaire['7artTherapyChecked'] === obj.artTherapy &&
    questionnaire['7otherGoods'] === obj.goodsUserInput &&
    questionnaire[8] === obj.otherService;

  const updateAnswer = (questionNum, newValue) =>
    setQuestionnaire(prev => ({
      ...prev,
      [questionNum]: newValue,
    }));

  const setOptionsDropdown = (lowerbound, upperbound) => {
    const options = [{label: '관심없음', value: -1}];
    for (let i = lowerbound; i <= upperbound; i++) {
      options.push({label: i, value: i});
    }
    return options;
  };

  const returnCheckBox = (question, key) => {
    return (
      <View style={styles.alignCommentAndBox}>
        <Text style={[styles.textStyle, {paddingRight: 10}]}>{question}</Text>
        <CheckBox
          containerStyle={styles.checkBox}
          size={22}
          checked={questionnaire[key]}
          onPress={() => updateAnswer(key, !questionnaire[key])}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          uncheckedColor={'#374957'}
          checkedColor={'#6395E1'}
        />
      </View>
    );
  };
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
    value,
    setValue,
    question,
    description,
    dropdownType,
    setDropdownType,
    dropdownIndex,
    lowerbound,
    upperbound,
  ) => {
    return (
      <View style={[styles.oneQuestion, {zIndex: dropdownIndex}]}>
        <View style={styles.alignQuestionAndBox}>
          <Text style={styles.textStyle}>{question}</Text>
          <DropDownComponent
            items={setOptionsDropdown(lowerbound, upperbound)}
            value={value}
            setValue={setValue}
            open={dropdownType}
            setOpen={setDropdownType}
            zIndex={dropdownIndex}
            whichPage={'ServiceQuestion'}
          />
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
        {returnCheckBox('- 반려동물이 주인공인 책 만들기', '7bookChecked')}
        {returnCheckBox('- 추모 굿즈 만들기 (컵, 액자 등)', '7goodsChecked')}
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
        {returnCheckBox('- 미술 심리 치료', '7artTherapyChecked')}
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
  function popPage() {
    navigation.pop(3);
    // return null;
  }

  const onSubmit = async () => {
    const inputObj = {
      id: cognitoUsername,
      numOfSurveys: numOfSurvey + 1,
      petSpace: questionnaire[1],
      communitySpace: questionnaire[2],
      individualOnlineCounseling: question3,
      groupOnlineCounseling: question4,
      individualOfflineCounseling: question5,
      groupOfflineCounseling: question6,
      book: questionnaire['7bookChecked'],
      goods: questionnaire['7goodsChecked'],
      goodsUserInput: questionnaire['7otherGoods'],
      artTherapy: questionnaire['7artTherapyChecked'],
      otherService: questionnaire[8],
    };
    // 1. first time survey, create a new item in db
    if (numOfSurvey === 0) {
      await mutationItem(
        isCallingAPI,
        setIsCallingAPI,
        inputObj,
        createServiceSurvey,
        '답변 감사합니다. 좋은 서비스 만들기 위해서 더 노력할께요!',
        popPage,
      );
      // 2. if any of the previous answer has been updated, update db
    } else if (!noChangeInResponse) {
      await mutationItem(
        isCallingAPI,
        setIsCallingAPI,
        inputObj,
        updateServiceSurvey,
        '답변 업데이트해 주셔서 감사해요 ^^ 더 좋은 서비스로 보답할께요!',
        popPage,
      );
      // if a returned user (item exists in db) and no answer has been changed, popPage
    } else {
      popPage();
    }
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        <Text style={styles.textStyle}>
          반려동물을 잃은 슬픔을 극복하는데 본인에게 도움이 되는 서비스를
          알려주세요!
        </Text>
        <View
          style={{
            width: 120,
            marginTop: 5,
          }}>
          <Button
            disabled={!canGoNext}
            title={'제출하기 >>'}
            titleStyle={styles.defaultTitleStyle}
            // containerStyle={styles.defaultContainerStyle}
            buttonStyle={styles.buttonStyle}
            onPress={onSubmit}
          />
        </View>
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
            *3-6번: 1회 상담시 본인이 최대로 지불할 금액을 선택해 주세요.
          </Text>
          {secondQuestions(
            question3,
            setQuestion3,
            '3. 개인(1:1) 온라인 심리상담 ',
            '(1회 50분)',
            onlineIndividual,
            setOnlineIndividual,
            500,
            6,
            10,
          )}
          {secondQuestions(
            question4,
            setQuestion4,
            '4. 그룹 온라인 심리상담',
            '(1회 90분, 4명 이하)',
            onlineGroup,
            setOnlineGroup,
            400,
            4,
            8,
          )}
          {secondQuestions(
            question5,
            setQuestion5,
            '5. 개인(1:1) 오프라인 심리상담',
            '(1회 50분)',
            offlineIndividual,
            setOfflineIndividual,
            300,
            8,
            12,
          )}
          {secondQuestions(
            question6,
            setQuestion6,
            '6. 그룹 오프라인 심리상담',
            '(1회 90분, 4명 이하)',
            offlineGroup,
            setOfflineGroup,
            200,
            6,
            10,
          )}
          {thirdQuestions()}
          {fourthQuestion()}
          {/*<View style={styles.blueButton}>*/}
          {/*  <BlueButton title={'메인 화면으로'} onPress={() => onSubmit()} />*/}
          {/*</View>*/}
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
    justifyContent: 'flex-start',
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
  textDescription: {
    fontSize: scaleFontSize(16),
    marginTop: 5,
    marginLeft: 10,
    color: '#373737',
  },
  textInputWrapper: {
    flexDirection: 'row',
    marginHorizontal: 30,
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
  buttonStyle: {
    backgroundColor: '#FFF',
    borderColor: '#6395E1',
    borderWidth: 1.5,
    borderRadius: 10,
  },
  defaultTitleStyle: {
    fontSize: scaleFontSize(18),
    color: '#6395E1',
    fontWeight: 'bold',
  },
});
