import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import globalStyle from '../assets/styles/globalStyle';
import {scaleFontSize} from '../assets/styles/scaling';

import reportReasons from '../data/reportReasons.json';
import {useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
const ReportBottomSheet = ({reportBottomSheetRef}) => {
  const petID = useSelector(state => state.pet.id);
  const userID = useSelector(state => state.user.cognitoUsername);

  const snapShort = useMemo(() => ['20%'], []);
  const snapTall = useMemo(() => ['72%'], []);
  const [showReasons, setShowReasons] = useState(false); // true - 신고 이유 리스트, false - 신고하기 버튼
  const reportBottomSheetDetailRef = useRef(null);

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

  const onSubmitReport = reason => {
    // Backend
    // Option 1. Send email to admin with current pet id, reporter's info, and report reason

    const reportID = uuid.v4();
    const emailContent =
      'ReportID' +
      reportID +
      '\nReporterID: ' +
      userID +
      '\npetID: ' +
      petID +
      '\nReport reason: ' +
      reason;

    return Alert.alert(
      '추모공간 신고 접수가 완료되었습니다.',
      '관리자의 신고 내역 확인 후 추후에 처리됩니다.',
      [
        {
          text: '확인',
        },
      ],
    );
  };

  const renderBottomSheetMenu = () => {
    return (
      <View style={styles.inner}>
        <Pressable
          style={styles.button}
          onPress={() => {
            setShowReasons(true);
          }}>
          <View style={styles.report}>
            <Text style={styles.title}>신고하기 </Text>
            <SimpleLineIcons name={'exclamation'} size={20} color={'#FA3B3B'} />
          </View>
        </Pressable>
      </View>
    );
  };

  const renderReportReason = ({item}) => {
    return (
      <Pressable
        style={styles.textContainer}
        onPress={() => onSubmitReport(item.content)}>
        <Text style={styles.text}>{item.content}</Text>
      </Pressable>
    );
  };

  const renderBottomSheetDetail = () => {
    return (
      <View style={globalStyle.flex}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerContainerText}>신고</Text>
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
          />
        </View>
      </View>
    );
  };

  return !showReasons ? (
    <BottomSheetModal
      ref={reportBottomSheetRef}
      index={0}
      snapPoints={snapShort}
      handleIndicatorStyle={{backgroundColor: '#939393'}}
      backgroundStyle={{borderRadius: 20}}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}>
      {renderBottomSheetMenu()}
    </BottomSheetModal>
  ) : (
    <BottomSheetModal
      ref={reportBottomSheetDetailRef}
      index={0}
      snapPoints={snapTall}
      handleIndicatorStyle={{backgroundColor: '#939393'}}
      backgroundStyle={{borderRadius: 20}}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onDismiss={() => setShowReasons(false)}>
      {renderBottomSheetDetail()}
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
});
