import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import {useSelector} from 'react-redux';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import {queryLettersByPetIDPagination} from '../../../utils/amplifyUtil';
import {scaleFontSize} from '../../../assets/styles/scaling';

const Letters = ({navigation}) => {
  const pageSize = 3;
  const petID = useSelector(state => state.user.currentPetID);
  const [lettersData, setLettersData] = useState({
    letters: [],
    nextToken: null,
  });
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);

  useEffect(() => {
    fetchLetters();
  }, [petID]);

  const fetchLetters = async () => {
    queryLettersByPetIDPagination(
      isLoadingLetters,
      setIsLoadingLetters,
      pageSize,
      petID,
      lettersData.nextToken,
    ).then(data => {
      const {letters, nextToken: newNextToken} = data;
      setLettersData(prev => ({
        letters: [...prev.letters, ...letters],
        nextToken: newNextToken,
      }));
    });
  };

  const renderFlatListItem = useCallback(({item}) => {
    return (
      <MoreLessTruncated item={item} linesToTruncate={2} whichTab={'Letters'} />
    );
  }, []);

  const renderWriteLetterButton = useCallback(() => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <DashedBorderButton
          type={'thin'}
          title={'편지쓰기'}
          titleColor={'gray'}
          circleSize={30}
          onPress={() => navigation.navigate('WriteLetter')}
        />
      </View>
    );
  }, []);

  const onEndReached = async () => {
    if (lettersData.nextToken !== null) {
      await fetchLetters();
    }
  };

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => setIsLoadingLetters(false)}
        onEndReachedThreshold={0.8}
        onEndReached={onEndReached}
        data={lettersData.letters}
        renderItem={renderFlatListItem}
        ListHeaderComponent={renderWriteLetterButton}
      />
    </View>
  );
};

export default Letters;

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: '#FFF',
    paddingTop: 15,
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
});
