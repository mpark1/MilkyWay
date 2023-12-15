import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';
import {deletePetIntroduction} from '../../../graphql/mutations';
import {mutationItem, querySingleItem} from '../../../utils/amplifyUtil';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DeleteAlertBox from '../../../components/DeleteAlertBox';
import {getIntroductionMessage} from '../../../graphql/queries';
import BottomSheetModalTextInputWrapper from '../../../components/BottomSheetModalTextInputWrapper';

const Home = ({navigation, route}) => {
  const {lastWord, petID} = route.params;
  const [introductionMsg, setIntroductionMsg] = useState('');
  // const originalMsgCopy = introductionMsg;
  const [fetchedData, setFetchedData] = useState(false);
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  useEffect(() => {
    querySingleItem(getIntroductionMessage, {petID: petID}).then(response =>
      setIntroductionMsg(response.getIntroductionMessage.introductionMsg),
    );
    setFetchedData(true);
  }, []);

  const renderLastWord = () => {
    return (
      <View style={styles.lastWordCard}>
        <Text style={styles.lastWordTitle}>마지막 인사</Text>
        <Text style={styles.lastWord}>{lastWord}</Text>
      </View>
    );
  };

  const renderDottedBorderButton = useCallback(() => {
    return (
      <View style={{paddingVertical: 20}}>
        <DashedBorderButton
          type={'thin'}
          title={'추모의 메세지를 입력해주세요'}
          titleColor={'gray'}
          circleSize={30}
          onPress={() => bottomSheetModalRef.current?.present()}
        />
      </View>
    );
  }, []);

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalRef2 = useRef(null);

  const onDeleteMessage = async () => {
    const deleteMessageInput = {
      petID: petID,
    };
    await mutationItem(
      isCallingAPI,
      setIsCallingAPI,
      deleteMessageInput,
      deletePetIntroduction,
      '추모의 메세지가 삭제되었습니다.',
      'none',
    );
  };

  const showIntroductionMessage = () => {
    return !introductionMsg ? (
      renderDottedBorderButton()
    ) : (
      <View style={styles.introductionMsg.container}>
        <View style={styles.introductionMsg.titleWithActionButtons}>
          <Text style={styles.introductionMsg.title}>추모의 메세지</Text>
          <View style={styles.introductionMsg.editAndDeleteContainer}>
            <Pressable onPress={() => bottomSheetModalRef2.current?.present()}>
              <EvilIcons name={'pencil'} color={'#373737'} size={26} />
            </Pressable>
            <Pressable onPress={() => DeleteAlertBox(onDeleteMessage)}>
              <EvilIcons name={'trash'} color={'#373737'} size={26} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.introductionMsg.text}>{introductionMsg}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={[globalStyle.backgroundWhite, globalStyle.flex]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.spacer}>
        {renderLastWord()}
        {!fetchedData ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          showIntroductionMessage()
        )}
      </View>
      {!introductionMsg ? (
        <BottomSheetModalTextInputWrapper
          petID={petID}
          whichTab={'Home'}
          option={'Create'}
          bottomSheetModalRef={bottomSheetModalRef}
          originalMsg={''}
        />
      ) : (
        <BottomSheetModalTextInputWrapper
          petID={petID}
          whichTab={'Home'}
          option={'Update'}
          bottomSheetModalRef={bottomSheetModalRef2}
          originalMsg={introductionMsg}
        />
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  spacer: {paddingTop: 15, paddingHorizontal: 15},
  lastWordCard: {
    padding: 10,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  lastWordTitle: {
    color: '#000',
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lastWord: {
    color: '#000',
    fontSize: scaleFontSize(18),
  },
  dottedBorderButton: {
    plusButtonContainer: {
      marginLeft: Dimensions.get('window').width * 0.03,
      marginRight: Dimensions.get('window').width * 0.07,
    },
    titleStyle: {fontSize: scaleFontSize(18), color: '#939393'},
    containerStyle: {
      width: '100%',
      height: 55,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#939393',
      alignSelf: 'center',
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginBottom: Dimensions.get('window').height * 0.05,
    },
    buttonColor: {
      backgroundColor: 'transparent',
    },
  },
  hideBottomSheetHandle: {
    height: 0,
  },
  bottomSheetInnerSpacer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: Dimensions.get('window').height * 0.05,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  bottomSheetTextInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#939393',
    height: '82%',
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(28),
    paddingLeft: 10,
  },
  bottomSheetActionButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '65%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#6395E1',
  },
  cancel: {
    color: '#6395E1',
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  submitButton: {
    borderRadius: 15,
  },
  submit: {
    color: '#FFF',
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  introductionMsg: {
    container: {
      flex: 1,
      paddingTop: 20,
      // justifyContent: 'space-between',
      // flexDirection: 'row',
    },
    title: {
      fontWeight: 'bold',
      fontSize: scaleFontSize(18),
      paddingLeft: 10,
      paddingBottom: 10,
    },
    titleWithActionButtons: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
    text: {
      fontSize: scaleFontSize(16),
      lineHeight: scaleFontSize(28),
      paddingLeft: 10,
    },
    editAndDeleteContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
});
