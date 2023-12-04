import React, {useCallback, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Button} from '@rneui/base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

const Home = ({navigation, route}) => {
  const lastWord = route.param;
  const renderLastWord = () => {
    return (
      <View style={styles.lastWordCard}>
        <Text style={styles.lastWordTitle}>마지막 인사</Text>
        <Text style={styles.lastWord}>{lastWord}</Text>
      </View>
    );
  };

  const renderDottedBorderButton = () => {
    const plusButton = (
      <View style={styles.dottedBorderButton.plusButtonContainer}>
        <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
      </View>
    );
    return (
      <View style={{paddingVertical: 20}}>
        <Button
          title={'추모의 메세지를 입력해주세요'}
          titleStyle={styles.dottedBorderButton.titleStyle}
          containerStyle={styles.dottedBorderButton.containerStyle}
          buttonStyle={styles.dottedBorderButton.buttonColor}
          onPress={() => bottomSheetModalRef.current?.present()}
          icon={plusButton}
        />
      </View>
    );
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
        pressBehavior={'none'}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  const snapPoints = useMemo(() => ['53%'], []);
  const bottomSheetModalRef = useRef(null);

  const renderBottomSheetCancelButton = () => {
    return (
      <Button
        title={'취소'}
        titleStyle={styles.cancel}
        containerStyle={styles.cancelButton}
        buttonStyle={globalStyle.backgroundWhite}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    );
  };

  const renderBottomSheetSubmitButton = () => {
    // TODO: onPress 하면 DB에 추모메세지 생성
    return (
      <Button
        title={'완료'}
        titleStyle={styles.submit}
        containerStyle={styles.submitButton}
        buttonStyle={globalStyle.backgroundBlue}
        // onPress={}
      />
    );
  };

  const renderBottomSheetModalInner = () => {
    return (
      <View style={styles.bottomSheetInnerSpacer}>
        <BottomSheetTextInput
          style={styles.bottomSheetTextInput}
          placeholder={
            '추모의 메세지를 입력해주세요. (아래 예시글)\n\n사랑하는 [이름]이 세상을 떠났습니다. [이름]은 태어난지 1주일만에 저희 집에 와서 저희와는 가족같이 지냈습니다. 솔직히 아직도 [이름]이 별이 되었다는게 믿어지지 않습니다. ' +
            '짧다면 짧고 길다면 긴 10년동안 가족같이 지내던 아이가 갑자기 없으니 너무 허전해요. ' +
            '같이 슬퍼해 주시고 애도해 주세요. [이름]이 좋은 곳에 갈 수 있게, 저희가 [이름]을 잘 보내줄 수 있게'
          }
          placeholderTextColor={'#939393'}
          textAlign={'left'}
          textAlignVertical={'top'}
          autoCorrect={false}
          multiline={true}
          scrollEnabled={true}
          maxLength={1000}
        />
        <View style={styles.bottomSheetActionButtons}>
          {renderBottomSheetCancelButton()}
          {renderBottomSheetSubmitButton()}
        </View>
      </View>
    );
  };
  const renderBottomSheetModal = () => {
    return (
      <BottomSheetModal
        handleIndicatorStyle={styles.hideBottomSheetHandle}
        handleStyle={styles.hideBottomSheetHandle}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backdropComponent={renderBackdrop}
        children={renderBottomSheetModalInner()}
      />
    );
  };

  return (
    <ScrollView
      style={[globalStyle.backgroundWhite, globalStyle.flex]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.spacer}>
        {renderLastWord()}
        {renderDottedBorderButton()}
        {renderBottomSheetModal()}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  spacer: {paddingTop: 15, paddingHorizontal: 15},
  lastWordCard: {
    padding: 10,
    backgroundColor: '#D9D9D9',
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
      borderWidth: 2,
      borderStyle: 'dotted',
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
});
