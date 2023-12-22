import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import {queryGuestBooksByPetIDPagination} from '../../../utils/amplifyUtil';
import {useSelector} from 'react-redux';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import BottomSheetModalTextInputWrapper from '../../../components/BottomSheetModalTextInputWrapper';
import globalStyle from '../../../assets/styles/globalStyle';

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
  const [isFetchComplete, setIsFetchComplete] = useState(false);

  useEffect(() => {
    const firstFetch = async () => {
      await fetchMessages();
      setIsFetchComplete(true);
    };
    firstFetch();
  }, [petID]);

  const fetchMessages = async () => {
    queryGuestBooksByPetIDPagination(
      isLoadingLetters,
      setIsLoadingLetters,
      pageSize,
      petID,
      guestBookData.nextToken,
    ).then(data => {
      const {letters, nextToken: newNextToken} = data;
      setGuestBookData(prev => ({
        guestMessages: [...prev.guestMessages, ...letters],
        nextToken: newNextToken,
      }));
    });
  };

  const renderLeaveMessageButton = useCallback(() => {
    return (
      isFetchComplete && (
        <View
          style={{
            padding: 15,
          }}>
          <DashedBorderButton
            type={'thin'}
            title={'추모 메세지 쓰기'}
            titleColor={'gray'}
            circleSize={30}
            onPress={() => bottomSheetModalRef.current?.present()}
          />
        </View>
      )
    );
  }, [isFetchComplete]);

  const onEndReached = async () => {
    if (guestBookData.nextToken !== null) {
      await fetchMessages();
    }
  };

  const bottomSheetModalRef = useRef(null);

  const renderFlatListItem = useCallback(({item}) => {
    return (
      <MoreLessTruncated
        item={item}
        linesToTruncate={2}
        whichTab={'GuestBook'}
      />
    );
  }, []);

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      {renderLeaveMessageButton()}
      {isFetchComplete && guestBookData.guestMessages.length > 0 && (
        <View style={styles.flatListContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.7}
            onEndReached={onEndReached}
            data={guestBookData.guestMessages}
            renderItem={renderFlatListItem}
            onMomentumScrollBegin={() => setIsLoadingLetters(false)}
          />
        </View>
      )}
      <BottomSheetModalTextInputWrapper
        petID={petID}
        whichTab={'GuestBook'}
        option={'Create'}
        bottomSheetModalRef={bottomSheetModalRef}
        originalMsg={''}
        userID={userID}
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
});
