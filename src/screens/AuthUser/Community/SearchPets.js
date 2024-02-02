import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';

import {petByName} from '../../../graphql/queries';
import {queryPetsPagination} from '../../../utils/amplifyUtil';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

import SearchBox from '../../../components/SearchBox';
import PetCard from '../../../components/PetCard';

const SearchPets = () => {
  const userID = useSelector(state => state.user.cognitoUsername);
  const {myPets} = useSelector(state => state.user);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const [petName, setPetName] = useState('');
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  // 0: before fetch, 1: while fetching, 2: after fetching
  const [isFetchComplete, setIsFetchComplete] = useState(0);

  const fetchSearchedPets = async (petName, firstFetch) => {
    setIsFetchComplete(1);
    console.log('print new petname: ', petName);
    firstFetch && setPetName(petName);
    const inputVariables = {
      name: petName,
      filter: {accessLevel: {eq: 'Public'}},
      limit: 5,
      nextToken: firstFetch ? null : petData.token,
    };
    queryPetsPagination(
      petByName,
      'petByName',
      inputVariables,
      isLoadingPets,
      setIsLoadingPets,
      myPets,
    ).then(data => {
      console.log('print fetched data inside SearchPets.js: ', data);
      const {pets, nextToken: newNextToken} = data;
      firstFetch
        ? setPetData({
            pets: [...pets],
            nextToken: newNextToken,
          })
        : setPetData(prev => ({
            pets: [...prev.pets, ...pets],
            nextToken: newNextToken,
          }));
      setIsFetchComplete(2);
    });
  };

  const onEndReached = async () => {
    if (petData.nextToken !== null) {
      await fetchSearchedPets(petName, false);
    }
  };

  const renderFlatList = useCallback(() => {
    return (
      <View style={styles.flatListContainer}>
        {petData.pets.length > 0 ? (
          <FlatList
            onMomentumScrollBegin={() => setIsLoadingPets(false)}
            onEndReachedThreshold={0.8}
            onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}
            data={petData.pets}
            renderItem={({item}) => <PetCard item={item} isFamily={false} />}
          />
        ) : (
          <Text>찾는 별이 존재하지 않습니다.</Text>
        )}
      </View>
    );
  }, [isFetchComplete, petData.pets]);

  return (
    <SafeAreaView style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.searchBoxAndButtonContainer}>
        <SearchBox
          fetchSearchedPets={fetchSearchedPets}
          isFetchComplete={isFetchComplete}
        />
      </View>
      {isFetchComplete === 1 && (
        <ActivityIndicator style={styles.activityIndicator} />
      )}
      {isFetchComplete === 2 && renderFlatList()}
    </SafeAreaView>
  );
};

export default SearchPets;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.07,
  },
  searchBoxAndButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  activityIndicator: {
    alignSelf: 'center',
    flex: 1,
  },
  flatListContainer: {
    paddingTop: Dimensions.get('window').height * 0.02,
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: 7,
  },
  buttonTitleStyle: {
    color: '#FFF',
    fontSize: scaleFontSize(18),
    paddingVertical: 4,
  },
  buttonBackgroundColor: {
    backgroundColor: '#939393',
  },
});
