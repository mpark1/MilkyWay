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
import {
  queryGuestBooksByPetIDPagination,
  queryUser,
} from '../../../utils/amplifyUtil';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import BottomSheetModalTextInputWrapper from '../../../components/BottomSheetModalTextInputWrapper';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';
import {
  onCreateGuestBook,
  onCreateLetter,
  onDeleteGuestBook,
  onDeleteLetter,
  onUpdateGuestBook,
  onUpdateLetter,
} from '../../../graphql/subscriptions';
import {
  addUserDetailsToNewObj,
  petPageTabsSubscription,
  processUpdateSubscription,
  sucriptionForAllMutation,
} from '../../../utils/amplifyUtilSubscription';
import BlueButton from '../../../components/Buttons/BlueButton';
import {Button} from '@rneui/base';
import {generateClient} from 'aws-amplify/api';

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
    console.log('GuestBook tab is mounted. print redux: ', petID);
    const firstFetch = async () => {
      await fetchMessages();
      setIsFetchComplete(true);
      console.log('Guestbook initial fetch complete!');
    };
    firstFetch();
    return () => {
      console.log('GuestBook tab is Unmounted!');
    };
  }, [petID]);

  useEffect(() => {
    const client = generateClient();
    // create mutation
    const createGuestBookSub = petPageTabsSubscription(
      client,
      onCreateGuestBook,
      'Create',
      processSubscriptionData,
      petID,
    );
    const deleteGuestBookSub = petPageTabsSubscription(
      client,
      onDeleteGuestBook,
      'Delete',
      processSubscriptionData,
      petID,
    );
    console.log('create, delete subscriptions are on for GuestBook table.');
    return () => {
      console.log('guestbook subscriptions are turned off!');
      createGuestBookSub.unsubscribe();
      deleteGuestBookSub.unsubscribe();
    };
  }, []);

  async function processSubscriptionData(mutationType, data) {
    // setIsLetterFetchComplete(false);
    switch (mutationType) {
      case 'Create':
        console.log(
          'print newly added guest message data: ',
          data.onCreateGuestBook,
        );
        const newGuestBookObj = await addUserDetailsToNewObj(
          data.onCreateGuestBook,
        );
        console.log(
          'print newly added guestbook data after adding user info: ',
          newGuestBookObj,
        );
        setGuestBookData(prev => ({
          ...prev,
          guestMessages: [newGuestBookObj, ...prev.guestMessages],
        }));
        break;

      case 'Delete':
        const deleteLetter = data.onDeleteGuestBook;
        setGuestBookData(prev => ({
          ...prev,
          guestMessages: prev.guestMessages.filter(
            message => message.id !== deleteLetter.id,
          ),
        }));
        break;
    }
    // setIsLetterFetchComplete(true);
  }

  const fetchMessages = async () => {
    queryGuestBooksByPetIDPagination(
      isLoadingLetters,
      setIsLoadingLetters,
      pageSize,
      petID,
      guestBookData.nextToken,
    ).then(data => {
      const {guestMessages, nextToken: newNextToken} = data;
      guestMessages !== null &&
        setGuestBookData(prev => ({
          guestMessages: [...prev.guestMessages, ...guestMessages],
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
          비공개 추모공간입니다. 가족 외의 사용자의 접근 허락하시려면 접근권한을
          바꿔주세요.
        </Text>
        {manager && (
          <Button
            title={'접근 권한 변경하러 가기'}
            onPress={() => navigation.navigate('Settings')}
            containerStyle={styles.navigateToSettings}
            buttonStyle={styles.buttonStyle}
          />
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
        <View style={globalStyle.flex}>
          {!isFamily ? renderLeaveMessageButton() : renderFamilyComponent()}
          {renderGuestBooks()}
        </View>
      ) : (
        renderIfPrivateSpace()
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
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 10,
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
  ifPrivate: {
    color: '#939393',
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    paddingHorizontal: 15,
  },
  emptyGuestBook: {
    color: '#374957',
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    padding: 15,
  },
  navigateToSettings: {
    fontSize: scaleFontSize(17),
    width: Dimensions.get('window').width * 0.6,
    paddingVertical: 15,
    paddingLeft: 15,
  },
  buttonStyle: {
    backgroundColor: '#6395E1',
    borderRadius: 10,
  },
});
