import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';

import ShortLetterPreview from '../../../components/Letters/ShortLetterPreview';
import LongLetterPreview from '../../../components/Letters/LongLetterPreview';
import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import mockData from '../../../data/letters.json';
import {pagination} from '../../../utils/pagination';
import {useSelector} from 'react-redux';
import {generateClient} from 'aws-amplify/api';
import {listLetters} from '../../../graphql/queries';

const Letters = ({navigation}) => {
  const pageSize = 3;
  const petID = useSelector(state => state.user.currentPetID);
  const [nextToken, setNextToken] = useState('');
  const [letters, setLetters] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedLetters, setRenderedLetters] = useState(mockData.slice(0, 2));
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);

  const fetchLetters = async () => {
    try {
      const client = generateClient();
      const response = await client.graphql({
        query: listLetters,
        variables: {petID: petID, limit: pageSize, nextToken: nextToken},
        authMode: 'userPool',
      });
      const {items, nextToken} = response.data.listLetters;
      console.log('letters and nextToken from db: ', items, nextToken);
      // set retrieved letters and nextToken
      setNextToken(nextToken);
      setLetters(items);
    } catch (error) {
      console.log('error for getting pets from db: ', error);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, [petID]);

  const renderFlatListItem = useCallback(({item}) => {
    return item.content.length > 60 ? (
      <LongLetterPreview
        profilePic={item.profilePic}
        title={item.title}
        relationship={item.relationship}
        name={item.name}
        content={item.content}
        timestamp={item.timestamp}
      />
    ) : (
      <ShortLetterPreview
        profilePic={item.profilePic}
        title={item.title}
        relationship={item.relationship}
        name={item.name}
        content={item.content}
        timestamp={item.timestamp}
      />
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

  const onEndReached = useCallback(async () => {
    if (!isLoadingLetters) {
      setIsLoadingLetters(true);
      await fetchLetters();
      setRenderedLetters(prev => [
        ...prev,
        ...pagination(mockData, pageNumber + 1, pageSize, setPageNumber),
      ]);
      setIsLoadingLetters(false);
    }
  }, [isLoadingLetters, pageNumber]);

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => setIsLoadingLetters(false)}
        onEndReachedThreshold={0.7}
        onEndReached={onEndReached}
        data={renderedLetters}
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
