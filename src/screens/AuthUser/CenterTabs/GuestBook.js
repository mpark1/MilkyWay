import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import {queryListItemsByPetIDPagination} from '../../../utils/amplifyUtil';
import {listGuestBooks} from '../../../graphql/queries';
import {useSelector} from 'react-redux';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
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
    return (
      <MoreLessTruncated
        item={item}
        linesToTruncate={2}
        whichTab={'GuestBook'}
      />
    );
  }, []);

  return (
    <View style={styles.flatListContainer}>
      {!fetchedData ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.7}
          onEndReached={onEndReached}
          data={guestBookData.guestMessages}
          renderItem={renderFlatListItem}
          ListHeaderComponent={renderLeaveMessageButton}
          onMomentumScrollBegin={() => setIsLoadingLetters(false)}
        />
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
