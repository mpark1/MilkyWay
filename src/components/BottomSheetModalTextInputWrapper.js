import React, {useCallback, useMemo, useState} from 'react';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Button} from '@rneui/base';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import globalStyle from '../assets/styles/globalStyle';
import {scaleFontSize} from '../assets/styles/scaling';
import {mutationItem} from '../utils/amplifyUtil';
import {
  createGuestBook,
  createPetIntroduction,
  updatePetIntroduction,
} from '../graphql/mutations';

const INTRO_MSG_PLACEHOLDER =
  '추모의 메세지를 입력해주세요. (아래 예시글)\n\n사랑하는 [이름]이 세상을 떠났습니다. [이름]은 태어난지 1주일만에 저희 집에 와서 저희와는 가족같이 지냈습니다. 솔직히 아직도 [이름]이 별이 되었다는게 믿어지지 않습니다. ' +
  '짧다면 짧고 길다면 긴 10년동안 가족같이 지내던 아이가 갑자기 없으니 너무 허전해요. ' +
  '[이름]이 좋은 곳에 갈 수 있게, 저희가 [이름]을 잘 보내줄 수 있게 같이 슬퍼해 주시고 애도해 주세요. ';

const GUESTBOOK_MSG_PLACEHOLDER = '방명록을 남겨주세요 (1000자 이내)';

const BottomSheetModalTextInputWrapper = ({
  petID,
  userID,
  whichTab, // Home or GuestBook
  option, // Create or Update
  bottomSheetModalRef,
  originalMsg,
}) => {
  const [newMessage, setNewMessage] = useState(originalMsg);
  const onChangeNewMessage = useCallback(text => setNewMessage(text), []);

  const snapPoints = useMemo(() => ['53%'], []);

  const [isCallingAPI, setIsCallingAPI] = useState(false);

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

  const createIntroduction = () => {
    const newIntroductionInput = {
      petID: petID,
      introductionMsg: newMessage,
    };

    mutationItem(
      isCallingAPI,
      setIsCallingAPI,
      newIntroductionInput,
      createPetIntroduction,
      '추모의 메세지가 등록되었습니다.',
      'none',
    );
  };

  const submitGuestMessage = () => {
    const newMessageInput = {
      petID: petID,
      content: newMessage,
      guestBookAuthorId: userID,
    };
    mutationItem(
      isCallingAPI,
      setIsCallingAPI,
      newMessageInput,
      createGuestBook,
      '방명록이 성공적으로 등록되었습니다.',
      'none',
    );
  };

  const updateIntroduction = async () => {
    const updateMessageInput = {
      petID: petID,
      introductionMsg: newMessage,
    };
    await mutationItem(
      isCallingAPI,
      setIsCallingAPI,
      updateMessageInput,
      updatePetIntroduction,
      '추모의 메세지가 업데이트되었습니다.',
      'none',
    );
  };

  const renderCancelButton = () => {
    return (
      <Button
        title={'취소'}
        titleStyle={styles.cancel}
        containerStyle={styles.cancelButton}
        buttonStyle={globalStyle.backgroundWhite}
        onPress={
          option === 'Create'
            ? () => {
                //  option === 'Create'
                setNewMessage('');
                bottomSheetModalRef.current?.close();
              }
            : () => {
                //  option === 'Update'
                setNewMessage(originalMsg);
                bottomSheetModalRef.current?.close();
              }
        }
      />
    );
  };

  const onSubmit = () => {
    switch (whichTab) {
      case 'Home':
        if (option === 'Create') {
          createIntroduction();
        } else if (option === 'Update') {
          updateIntroduction();
        }
        break;
      case 'GuestBook':
        submitGuestMessage();
        break;
      default:
        console.log('nothing was done during submit in bottomsheetmodal.');
    }
    bottomSheetModalRef.current?.close();
  };

  const renderSubmitButton = () => {
    return (
      <Button
        title={'완료'}
        titleStyle={styles.submit}
        containerStyle={styles.submitButton}
        buttonStyle={globalStyle.backgroundBlue}
        onPress={() => {
          onSubmit();
        }}
      />
    );
  };

  const renderModalInner = () => {
    return (
      <View style={styles.bottomSheetInnerSpacer}>
        {option === 'Create' ? (
          <BottomSheetTextInput
            style={styles.bottomSheetTextInput}
            placeholder={
              whichTab === 'Home'
                ? INTRO_MSG_PLACEHOLDER
                : GUESTBOOK_MSG_PLACEHOLDER
            }
            onChangeText={onChangeNewMessage}
            placeholderTextColor={'#939393'}
            textAlign={'left'}
            textAlignVertical={'top'}
            autoCorrect={false}
            multiline={true}
            scrollEnabled={true}
            maxLength={1000}
          />
        ) : (
          <BottomSheetTextInput
            style={styles.bottomSheetTextInput}
            defaultValue={originalMsg}
            onChangeText={onChangeNewMessage}
            placeholderTextColor={'#000'}
            textAlign={'left'}
            textAlignVertical={'top'}
            autoCorrect={false}
            multiline={true}
            scrollEnabled={true}
            maxLength={1000}
          />
        )}
        <View style={styles.bottomSheetActionButtons}>
          {renderCancelButton()}
          {renderSubmitButton()}
        </View>
      </View>
    );
  };

  return (
    <BottomSheetModal
      handleIndicatorStyle={styles.hideBottomSheetHandle}
      handleStyle={styles.hideBottomSheetHandle}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      children={renderModalInner()}
    />
  );
};

export default BottomSheetModalTextInputWrapper;

const styles = StyleSheet.create({
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
