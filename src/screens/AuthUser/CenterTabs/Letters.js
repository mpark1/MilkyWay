import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import {useSelector} from 'react-redux';
import {listLetters} from '../../../graphql/queries';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import {queryListItemsByPetIDPagination} from '../../../utils/amplifyUtil';

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
    queryListItemsByPetIDPagination(
      isLoadingLetters,
      setIsLoadingLetters,
      listLetters,
      pageSize,
      petID,
      lettersData.nextToken,
    ).then(data => {
      const {items, nextToken: newNextToken} = data.listLetters;
      setLettersData(prev => ({
        letters: [...prev.letters, ...items],
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
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
});
