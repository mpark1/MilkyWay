import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';

import {
  queryLettersByPetIDPagination,
  queryUser,
  retrieveS3Url,
} from '../../../utils/amplifyUtil';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import MoreLessTruncated from '../../../components/MoreLessTruncated';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';
import {
  addUserDetailsToNewObj,
  petPageTabsSubscription,
  processUpdateSubscription,
  sucriptionForAllMutation,
  supscriptionForCreate,
} from '../../../utils/amplifyUtilSubscription';
import {
  onCreateLetter,
  onDeleteLetter,
  onUpdateLetter,
} from '../../../graphql/subscriptions';
import {generateClient} from 'aws-amplify/api';

const Letters = ({navigation, route}) => {
  const isFamily = route.params.isFamily;
  const pageSize = 3;
  const petID = useSelector(state => state.pet.id);
  const userID = useSelector(state => state.user.cognitoUsername);
  const [lettersData, setLettersData] = useState({
    letters: [],
    nextToken: null,
  });
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);
  const [isLetterFetchComplete, setIsLetterFetchComplete] = useState(false);
  // Ref to track the latest letters data
  const lettersDataRef = useRef(lettersData.letters);

  useEffect(() => {
    const firstFetch = async () => {
      try {
        await fetchLetters();
        console.log('Letter tab is rendered');
      } catch (e) {
        console.log('Letter tab: error occurred during fetching');
      }
    };
    firstFetch().then(data => {
      setIsLetterFetchComplete(true);
    });
  }, [petID]);

  useEffect(() => {
    lettersDataRef.current = lettersData.letters;
  }, [lettersData.letters]);

  // useEffect(() => {
  //   const client = generateClient();
  //   // create mutation
  //   const createLetterSub = petPageTabsSubscription(
  //     client,
  //     onCreateLetter,
  //     'Create',
  //     processSubscriptionData,
  //     petID,
  //   );
  //   const updateLetterSub = petPageTabsSubscription(
  //     client,
  //     onUpdateLetter,
  //     'Update',
  //     processSubscriptionData,
  //     petID,
  //   );
  //   const deleteLetterSub = petPageTabsSubscription(
  //     client,
  //     onDeleteLetter,
  //     'Delete',
  //     processSubscriptionData,
  //     petID,
  //   );
  //   console.log(
  //     'create, update, delete subscriptions are on for Letters table.',
  //   );
  //
  //   return () => {
  //     console.log('letter subscriptions are turned off!');
  //     createLetterSub.unsubscribe();
  //     updateLetterSub.unsubscribe();
  //     deleteLetterSub.unsubscribe();
  //   };
  // }, []);

  async function processSubscriptionData(mutationType, data) {
    // setIsLetterFetchComplete(false);
    switch (mutationType) {
      case 'Create':
        // return Letter in db
        const newLetterObj = await addUserDetailsToNewObj(data.onCreateLetter);
        console.log('print newly added letter data: ', newLetterObj);
        setLettersData(prev => ({
          ...prev,
          letters: [newLetterObj, ...prev.letters],
        }));
        break;

      case 'Update':
        const updatedLetterObj = data.onUpdateLetter;
        const currentLetters = lettersDataRef.current;
        const updatedLettersArray = await processUpdateSubscription(
          currentLetters,
          updatedLetterObj,
        );
        setLettersData(prev => ({
          ...prev,
          letters: updatedLettersArray,
        }));
        break;

      case 'Delete':
        const deleteLetter = data.onDeleteLetter;
        setLettersData(prev => ({
          ...prev,
          letters: prev.letters.filter(letter => letter.id !== deleteLetter.id),
        }));
        break;
    }
    // setIsLetterFetchComplete(true);
  }

  const fetchLetters = async () => {
    queryLettersByPetIDPagination(
      isLoadingLetters,
      setIsLoadingLetters,
      pageSize,
      petID,
      lettersData.nextToken,
    ).then(data => {
      const {letters, nextToken: newNextToken} = data;
      letters.length !== 0 &&
        setLettersData(prev => ({
          letters: [...prev.letters, ...letters],
          nextToken: newNextToken,
        }));
    });
  };

  const renderFlatListItem = useCallback(({item}) => {
    return (
      (item.accessLevel === 'PUBLIC' || item.owner === userID) && (
        <MoreLessTruncated
          item={item}
          linesToTruncate={2}
          whichTab={'Letters'}
        />
      )
    );
  }, []);

  const renderWriteLetterButton = useCallback(() => {
    return (
      isLetterFetchComplete && (
        <View
          style={{
            padding: 15,
          }}>
          <DashedBorderButton
            type={'thin'}
            title={'편지쓰기'}
            titleColor={'gray'}
            circleSize={30}
            onPress={() => navigation.navigate('WriteLetter')}
          />
        </View>
      )
    );
  }, [isLetterFetchComplete, lettersData.letters]);

  const onEndReached = async () => {
    if (lettersData.nextToken !== null) {
      await fetchLetters();
    }
  };

  const renderLetters = () => {
    return lettersData.letters.length > 0 ? (
      <View style={styles.flatListContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          onMomentumScrollBegin={() => setIsLoadingLetters(false)}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          data={lettersData.letters}
          renderItem={renderFlatListItem}
        />
      </View>
    ) : (
      <Text style={styles.emptyLetters}>등록된 가족의 편지가 없습니다.</Text>
    );
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      {isFamily && renderWriteLetterButton()}
      {isLetterFetchComplete ? renderLetters() : <ActivityIndicator />}
    </View>
  );
};

export default Letters;

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  letter: {
    container: {
      borderBottomWidth: 1,
      borderColor: '#D9D9D9',
      paddingHorizontal: 20,
      paddingVertical: 13,
    },
    title: {
      color: '#374957',
      fontSize: scaleFontSize(17),
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
    messageContainer: {
      flex: 1,
      paddingLeft: 5,
      marginLeft: 25,
    },
    nameRelationshipDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginBottom: 7,
      // backgroundColor: '#EEEEEE',
    },
    name: {
      fontWeight: 'bold',
      fontSize: scaleFontSize(16),
      color: '#374957',
    },
    relationshipAndDate: {
      color: '#939393',
      fontSize: scaleFontSize(16),
    },
    content: {
      color: '#374957',
      fontSize: scaleFontSize(16),
      lineHeight: scaleFontSize(24),
      paddingTop: 10,
    },
    editAndDeleteContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
    },
    actionButtonsContainer: {flexDirection: 'row', justifyContent: 'flex-end'},
    seeLessOrMore: {
      title: {
        color: '#939393',
        fontSize: scaleFontSize(14),
        lineHeight: scaleFontSize(24),
      },
    },
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
  emptyLetters: {
    color: '#374957',
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    padding: 15,
  },
});
