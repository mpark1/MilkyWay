import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import {useSelector} from 'react-redux';
import {generateClient} from 'aws-amplify/api';
import {listLetters} from '../../../graphql/queries';
import MoreLessTruncated from '../../../components/MoreLessTruncated';

const Letters = ({navigation}) => {
  const pageSize = 3;
  const petID = useSelector(state => state.user.currentPetID);
  // const [nextToken, setNextToken] = useState('');
  const [lettersData, setLettersData] = useState({
    letters: [],
    nextToken: null,
  });
  // const [pageNumber, setPageNumber] = useState(1);
  // const [renderedLetters, setRenderedLetters] = useState([]);
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);

  useEffect(() => {
    fetchLetters();
  }, [petID]);

  const fetchLetters = async () => {
    if (!isLoadingLetters) {
      setIsLoadingLetters(true);
      try {
        const client = generateClient();
        const response = await client.graphql({
          query: listLetters,
          variables: {
            petID: petID,
            limit: pageSize,
            nextToken: lettersData.nextToken,
          },
          authMode: 'userPool',
        });
        console.log('response from fetch Letters: ', response.data.listLetters);
        const {items, nextToken: newNextToken} = response.data.listLetters;
        setLettersData(prev => ({
          letters: [...prev.letters, ...items],
          nextToken: newNextToken,
        }));
      } catch (error) {
        console.log('error for getting letters from db: ', error);
      } finally {
        setIsLoadingLetters(false);
      }
    }
  };

  const renderFlatListItem = useCallback(({item}) => {
    return <MoreLessTruncated item={item} linesToTruncate={2} />;
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
          onPress={() =>
            navigation.navigate('WriteOrEditLetter', {
              actionType: 'write',
              title: '',
              relationship: '',
              isPrivate: false,
              message: '',
            })
          }
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
