import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';

import {deleteLetter} from '../graphql/mutations';
import {mutationItem, queryMyPetsPagination} from '../utils/amplifyUtil';
import {isSmall, scaleFontSize} from '../assets/styles/scaling';

import MoreLessComponent from './MoreLess';
import DeleteIcon from './DeleteIcon';
import DeleteAlertBox from './DeleteAlertBox';
import OtherUserPet from './OtherUserPet';
import globalStyle from '../assets/styles/globalStyle';

const MoreLessTruncated = ({item, linesToTruncate, whichTab}) => {
  const userID = useSelector(state => state.user.cognitoUsername);
  const [isTruncated, setIsTruncated] = useState(false);
  const [clippedText, setClippedText] = useState('');
  const text = item.content.trim();
  const navigation = useNavigation();
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);

  // For whichTab === 'GuestBook' - when author's name is clicked, present bottomSheet listing the author's pets
  const snapPoints = useMemo(() => [isSmall ? '35%' : '30%'], []);
  const userPetsBottomSheetModalRef = useRef(null);
  const [isLoadingClickedUserPets, setIsLoadingClickedUserPets] =
    useState(false);
  const [bottomSheetPetData, setBottomSheetPetData] = useState({
    pets: [],
    nextToken: null,
  });

  useEffect(() => {
    console.log('MoreLessTruncated component - Mounted');
    return () => {
      console.log('MoreLessTruncated - Unmounted');
    };
  }, []);

  const handleTextLayout = event => {
    const {lines} = event.nativeEvent;
    if (lines.length > linesToTruncate) {
      setIsTruncated(true);
      let displayedText = lines
        .slice(0, linesToTruncate)
        .map(line => line.text)
        .join('');
      setClippedText(displayedText.substring(0, displayedText.length - 4));
    }
  };

  const deleteLetterOnSubmit = async () => {
    const deleteLetterInput = {
      id: item.id,
      petID: item.petID,
      createdAt: item.createdAt,
    };
    await mutationItem(
      isCallingAPI,
      setIsCallingAPI,
      deleteLetterInput,
      deleteLetter,
      '편지가 성공적으로 삭제되었습니다.',
      'none',
    );
  };

  const fetchClickedUserPets = async guestbookAuthorID => {
    try {
      await queryMyPetsPagination(
        guestbookAuthorID,
        isLoadingClickedUserPets,
        setIsLoadingClickedUserPets,
        3,
        bottomSheetPetData.nextToken,
        'Public',
      ).then(data => {
        console.log("print fetched clicked user's data: ", data);
        const {pets, nextToken: newNextToken} = data;
        setBottomSheetPetData(prev => ({
          pets: [...prev.pets, ...pets],
          nextToken: newNextToken,
        }));
        setIsFetchComplete(true);
        console.log('fetch complete for bottomsheet');
        userPetsBottomSheetModalRef.current?.present();
      });
    } catch (error) {
      console.log('Error in fetchClickedUserPets', error);
    } finally {
      setIsFetchComplete(true);
    }
  };

  const onBottomSheetFlatListEndReached = async () => {
    if (bottomSheetPetData.nextToken !== null) {
      await fetchClickedUserPets();
    }
  };

  const updateLetterOnSubmit = () => {
    navigation.navigate('EditLetter', {item: item});
  };

  const renderAuthorProfilePic = () => {
    return (
      <View style={styles.profilePicContainer}>
        {item.profilePic.length > 0 ? (
          <Image
            style={styles.profilePic}
            source={{
              uri: item.profilePic,
            }}
            resizeMode={'cover'}
          />
        ) : (
          <Image
            style={styles.profilePic}
            source={require('../assets/images/default_user_profilePic.jpg')}
            resizeMode={'cover'}
          />
        )}
      </View>
    );
  };

  const renderTruncatedTextForIOS = () => {
    return (
      Platform.OS === 'ios' && (
        <Text
          style={{height: 0}}
          onTextLayout={event => {
            const {lines} = event.nativeEvent;
            if (lines.length > linesToTruncate) {
              setIsTruncated(true);
              let text = lines
                .splice(0, linesToTruncate)
                .map(line => line.text)
                .join('');
              setClippedText(text.substring(0, text.length - 4));
            }
          }}>
          {text}
        </Text>
      )
    );
  };

  const renderNameRelationshipDate = () => {
    return (
      <View style={styles.nameRelationshipDateContainer}>
        <Pressable
          disabled={whichTab === 'Letters' || item.owner === userID}
          onPress={() => {
            fetchClickedUserPets(item.guestBookAuthorId);
          }}>
          <Text style={styles.name}>
            {item.userName}
            {'   '}
          </Text>
        </Pressable>
        {whichTab === 'Letters' && (
          <Text style={styles.relationship}>{item.relationship}</Text>
        )}
        <Text style={styles.relationship}>
          ({item.createdAt.substring(0, 10)})
        </Text>
      </View>
    );
  };

  const renderText = () => {
    return isTruncated ? (
      <MoreLessComponent
        truncatedText={clippedText}
        fullText={text}
        item={item}
        whichTab={whichTab}
      />
    ) : (
      <Text
        style={styles.content}
        numberOfLines={linesToTruncate}
        onTextLayout={handleTextLayout}>
        {text}
      </Text>
    );
  };

  const renderAuthorActionButtons = () => {
    return (
      <View style={styles.editAndDeleteContainer}>
        {whichTab === 'Letters' && !isTruncated && item.owner === userID && (
          <View style={styles.editAndDeleteContainerInner}>
            <Pressable onPress={() => updateLetterOnSubmit()}>
              <EvilIcons name={'pencil'} color={'#373737'} size={26} />
            </Pressable>
            <Pressable onPress={() => DeleteAlertBox(deleteLetterOnSubmit)}>
              <EvilIcons name={'trash'} color={'#373737'} size={26} />
            </Pressable>
          </View>
        )}
        {whichTab === 'GuestBook' && !isTruncated && item.owner === userID && (
          <DeleteIcon item={item} />
        )}
      </View>
    );
  };

  const renderBottomSheetBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
        pressBehavior={'close'}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => {
          setBottomSheetPetData({pets: [], nextToken: null});
        }}
      />
    ),
    [],
  );

  const renderClickedUserPets = useCallback(() => {
    return (
      <View
        style={[
          globalStyle.flex,
          globalStyle.backgroundWhite,
          styles.bottomSheet.inner,
        ]}>
        <Text style={styles.bottomSheet.clickedUserName}>
          {item.userName}님의 은하수
        </Text>
        {!isFetchComplete ? (
          <View style={styles.bottomSheet.activityIndicatorContainer}>
            <ActivityIndicator />
          </View>
        ) : bottomSheetPetData.pets.length > 0 ? (
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollBegin={() => setIsLoadingClickedUserPets(false)}
            onEndReachedThreshold={0.5}
            onEndReached={onBottomSheetFlatListEndReached}
            style={styles.bottomSheet.flatList}
            data={bottomSheetPetData.pets}
            renderItem={({item}) => (
              <OtherUserPet
                item={item}
                bottomSheetRef={userPetsBottomSheetModalRef}
                navigation={navigation}
              />
            )}
          />
        ) : (
          <Text style={(styles.bottomSheet.clickedUserName, {paddingTop: 10})}>
            {item.userName}님이 개설한 추모공간이 없습니다.
          </Text>
        )}
      </View>
    );
  }, [bottomSheetPetData.pets, isFetchComplete, item.guestBookAuthorId]);

  return (
    <>
      <View style={styles.letter}>
        {whichTab === 'Letters' && (
          <Text style={styles.title}>{item.title}</Text>
        )}
        <View style={styles.flexDirectionRow}>
          {renderAuthorProfilePic()}
          <View style={styles.collapsedTextContainer}>
            {renderTruncatedTextForIOS()}
            {renderNameRelationshipDate()}
            {renderText()}
            {renderAuthorActionButtons()}
          </View>
        </View>
      </View>
      <BottomSheetModal
        handleStyle={styles.bottomSheet.handle}
        ref={userPetsBottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBottomSheetBackdrop}
        children={renderClickedUserPets}
      />
    </>
  );
};

export default MoreLessTruncated;

const styles = StyleSheet.create({
  letter: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  title: {
    color: '#374957',
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    paddingBottom: 7,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  profilePicContainer: {
    height: 80,
    width: 80,
    marginTop: 8,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  collapsedTextContainer: {
    flex: 1,
    paddingLeft: 5,
    marginLeft: 25,
  },
  nameRelationshipDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 7,
  },
  name: {
    fontWeight: 'bold',
    fontSize: scaleFontSize(18),
    color: '#374957',
  },
  relationship: {
    paddingRight: 5,
    color: '#939393',
    fontSize: scaleFontSize(16),
  },
  content: {
    color: '#374957',
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    paddingTop: 10,
  },
  editAndDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  editAndDeleteContainerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
  bottomSheet: {
    handle: {
      height: 0,
    },
    inner: {
      marginVertical: Dimensions.get('window').height * 0.02,
      paddingHorizontal: 20,
    },
    clickedUserName: {
      alignSelf: 'center',
      color: '#374957',
      fontSize: scaleFontSize(18),
    },
    flatList: {
      flex: 1,
      marginVertical: '3%',
    },
    activityIndicatorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
});
