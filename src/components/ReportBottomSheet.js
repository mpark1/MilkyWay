import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {mutationItem} from '../utils/amplifyUtil';
import {createManager} from '../graphql/mutations';

import globalStyle from '../assets/styles/globalStyle';
import {scaleFontSize} from '../assets/styles/scaling';

import reportReasons from '../data/reportReasons.json';
import {generateClient} from 'aws-amplify/api';
import alertBox from './AlertBox';

const ReportBottomSheet = ({reportBottomSheetRef}) => {
  const petID = useSelector(state => state.pet.id);
  const userID = useSelector(state => state.user.cognitoUsername);

  const snapPoint = useMemo(() => ['72%'], []);
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  const [requesterComment, setRequesterComment] = useState('');

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'close'}
        disappearsOnIndex={-1} //-1: Snap point index when backdrop will disappears on.
        appearsOnIndex={0} //0: Snap point index when backdrop will appears on.
      />
    ),
    [],
  );

  const onSubmitReport = async index => {
    reportBottomSheetRef.current?.close();
    const newReportInput = {
      petID: petID,
      requesterID: userID,
      category: index, // Int (신고 이유 리스트에서 인덱스)
      clientMessage: requesterComment,
      status: '0', // 처리전
      adminComment: '',
    };

    try {
      if (!isCallingAPI) {
        setIsCallingAPI(true);
        const client = generateClient();
        const response = await client.graphql({
          query: createManager,
          variables: {input: newReportInput},
          authMode: 'userPool',
        });
        alertBox(
          '신고가 성공적으로 접수되었습니다.',
          '관리자가 신고 내역 확인 후 처리됩니다.',
          '확인',
          'none',
        );
        return response;
      }
    } catch (error) {
      console.log('error during query: ', error);
    } finally {
      setIsCallingAPI(false);
    }
  };

  const renderReportReason = ({item, index}) => {
    return (
      <Pressable
        disabled={index === 7}
        style={styles.textContainer}
        onPress={() => onSubmitReport(index)}>
        <Text style={styles.text}>{item.content}</Text>
      </Pressable>
    );
  };

  const renderTextInput = () => {
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholderTextColor={'#939393'}
          placeholder={'신고 이유를 입력해주세요. (100자 이내)'}
          maxLength={100}
          value={requesterComment}
          onChangeText={text => setRequesterComment(text)}
          autoCorrect={false}
          autoCapitalize={'none'}
          blurOnSubmit={true}
          clearButtonMode={'while-editing'}
        />
        <Pressable
          disabled={requesterComment.length === 0}
          style={styles.submitButton}
          onPress={() => onSubmitReport(7)}>
          <Text style={styles.submitButtonText}>확인</Text>
        </Pressable>
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <View style={globalStyle.flex}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerContainerText}>신고하기</Text>
        </View>
        <View style={styles.flatListContainer}>
          <Text style={styles.header}>
            이 추모공간을 신고하는 이유를 알려주세요.
          </Text>
          <Text style={styles.greyText}>
            지식 재산권 침해의 경우를 제외하고는 회원님의 신고는 익명으로
            처리됩니다. 위급한 상황일 경우에는 응급 서비스 기관에 연락하세요.
          </Text>
          <BottomSheetFlatList
            style={globalStyle.flex}
            data={reportReasons}
            keyExtractor={item => item.id}
            renderItem={renderReportReason}
            showsVerticalScrollIndicator={true}
            ListFooterComponent={renderTextInput}
          />
        </View>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={reportBottomSheetRef}
      index={0}
      snapPoints={snapPoint}
      handleIndicatorStyle={{backgroundColor: '#939393'}}
      backgroundStyle={{borderRadius: 20}}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}>
      {renderFlatList()}
    </BottomSheetModal>
  );
};

export default ReportBottomSheet;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    flex: 0.4,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  report: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#000000',
  },
  flatListContainer: {
    paddingHorizontal: 27,
    flex: 1,
  },
  textContainer: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomColor: '#D9D9D9',
  },
  text: {
    color: '#374957',
    fontSize: scaleFontSize(16),
    lineHeight: 29,
  },
  header: {
    color: '#374957',
    fontSize: scaleFontSize(16),
    lineHeight: 29,
    fontWeight: 'bold',
  },
  greyText: {
    color: '#939393',
    fontSize: scaleFontSize(14),
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  headerContainerText: {
    color: '#000000',
    fontSize: scaleFontSize(18),
    fontWeight: '500',
  },
  textInputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    height: 100,
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#E5E5E5',
  },
  submitButtonText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#000000',
    fontSize: scaleFontSize(18),
  },
});
