import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';
import {queryGuestBooksByPetIDPagination} from '../../../utils/amplifyUtil';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import BottomSheetModalTextInputWrapper from '../../../components/BottomSheetModalTextInputWrapper';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

const GuestBook = ({navigation, route}) => {
  const {isFamily} = route.params;
  const pageSize = 3;
  const {accessLevel, manager} = useSelector(state => state.pet);
  const petID = useSelector(state => state.pet.id);
  const userID = useSelector(state => state.user.cognitoUsername);
  const [guestBookData, setGuestBookData] = useState({
    guestMessages: [],
    nextToken: null,
  });
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);

  useEffect(() => {
    const firstFetch = async () => {
      await fetchMessages();
      setIsFetchComplete(true);
    };
    console.log('GuestBook tab is rendered');
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
      console.log('print fetched 방명록: ', letters[0]);
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
            paddingVertical: 10,
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

  const renderIfPrivateSpace = () => {
    return (
      <View style={styles.flatListContainer}>
        <Text style={styles.ifPrivate}>
          비공개 추모공간의 방명록 입니다. 추모공간 관리자는 공간의 접근 권한을
          설정할 수 있습니다. 전체공개로 변경 시 가족 외의 사용자가 방명록에
          추모 메세지를 남겨 함께 애도할 수 있습니다.
        </Text>
        {manager === 'Private' && (
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.navigateToSettings}>
              접근 권한 변경하러 가기
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderFamilyComponent = () => {
    return (
      guestBookData.guestMessages.length === 0 && (
        <View>
          <Text style={styles.emptyGuestBook}>등록된 방명록이 없습니다.</Text>
        </View>
      )
    );
  };
  const renderGuestBooks = () => {
    return (
      isFetchComplete && (
        <View style={styles.flatListContainer}>
          {guestBookData.guestMessages.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.7}
              onEndReached={onEndReached}
              data={guestBookData.guestMessages}
              renderItem={renderFlatListItem}
              onMomentumScrollBegin={() => setIsLoadingLetters(false)}
            />
          )}
        </View>
      )
    );
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      {accessLevel === 'Public' ? (
        <View>
          {!isFamily ? renderLeaveMessageButton() : renderFamilyComponent()}
          {renderGuestBooks()}
          <BottomSheetModalTextInputWrapper
            petID={petID}
            whichTab={'GuestBook'}
            option={'Create'}
            bottomSheetModalRef={bottomSheetModalRef}
            originalMsg={''}
            userID={userID}
          />
        </View>
      ) : (
        renderIfPrivateSpace()
      )}
    </View>
  );
};

export default GuestBook;

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: '#FFF',
    paddingTop: 10,
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
  ifPrivate: {
    color: '#374957',
    fontSize: scaleFontSize(18),
  },
  emptyGuestBook: {
    color: '#374957',
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    padding: 15,
  },
  navigateToSettings: {
    color: '#374957',
    fontSize: scaleFontSize(17),
    paddingVertical: 7,
  },
});
