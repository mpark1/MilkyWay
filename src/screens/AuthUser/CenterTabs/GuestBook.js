import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Button} from '@rneui/base';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {scaleFontSize} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import {
  mutationItem,
  queryListItemsByPetIDPagination,
} from '../../../utils/amplifyUtil';
import {listGuestBooks} from '../../../graphql/queries';
import {useSelector} from 'react-redux';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import {createGuestBook, createLetter} from '../../../graphql/mutations';
import BottomSheetModalTextInputWrapper from '../../../components/BottomSheetModalTextInputWrapper';

const GuestBook = ({navigation}) => {
  const pageSize = 3;
  const petID = useSelector(state => state.user.currentPetID);
  const userID = useSelector(state => state.user.cognitoUsername);
  const [guestBookData, setGuestBookData] = useState({
    guestMessages: [],
    nextToken: null,
  });
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);
  const [fetchedData, setFetchedData] = useState(false);
  const [isCallingAPI, setIsCallingAPI] = useState(false);


  useEffect(() => {
    fetchMessages();
    setFetchedData(true);
  }, [petID]);

  const fetchMessages = async () => {
    queryListItemsByPetIDPagination(
      isLoadingLetters,
      setIsLoadingLetters,
      listGuestBooks,
      pageSize,
      petID,
      guestBookData.nextToken,
    ).then(data => {
      const {items, nextToken: newNextToken} = data.listGuestBooks;
      setGuestBookData(prev => ({
        guestMessages: [...prev.guestMessages, ...items],
        nextToken: newNextToken,
      }));
    });
  };

  // const onSubmit = () => {
  //   const newMessageInput = {
  //     petID: petID,
  //     content: newMessage,
  //     guestBookAuthorId: userID,
  //   };
  //   mutationItem(
  //     isCallingAPI,
  //     setIsCallingAPI,
  //     newMessageInput,
  //     createGuestBook,
  //     '방명록이 성공적으로 등록되었습니다.',
  //     'none',
  //   );
  // };

  const renderLeaveMessageButton = useCallback(() => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <DashedBorderButton
          type={'thin'}
          title={'추모 메세지 쓰기'}
          titleColor={'gray'}
          circleSize={30}
          onPress={() => bottomSheetModalRef.current?.present()}
        />
      </View>
    );
  }, []);

  const onEndReached = async () => {
    if (guestBookData.nextToken !== null) {
      await fetchMessages();
    }
  };

  const bottomSheetModalRef = useRef(null);

  const renderFlatListItem = useCallback(({item}) => {
    return <MoreLessTruncated item={item} linesToTruncate={2} />;
  }, []);

  return (
    <View style={styles.flatListContainer}>
      {!fetchedData ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          onMomentumScrollBegin={() => setIsLoadingMessages(false)}
          onEndReachedThreshold={0.7}
          onEndReached={onEndReached}
          data={guestBookData.guestMessages}
          renderItem={renderFlatListItem}
          ListHeaderComponent={renderLeaveMessageButton}
        />
      )}
       <BottomSheetModalTextInputWrapper
        petID={petID}
        whichTab={'GuestBook'}
        option={'CREATE'}
        bottomSheetModalRef={bottomSheetModalRef}
        mutationName={'createGuestBookMessage'}
      />
    </View>
  );
};

export default GuestBook;

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: '#FFF',
    paddingTop: 15,
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
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
