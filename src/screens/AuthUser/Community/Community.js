import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import globalStyle from '../../../assets/styles/globalStyle';
import PetCard from '../../../components/PetCard';
import {queryPetsPagination} from '../../../utils/amplifyUtil';
import {useSelector} from 'react-redux';
import SearchBox from '../../../components/SearchBox';
import {petByName, petsByAccessLevel} from '../../../graphql/queries';

const Community = ({navigation}) => {
  const pageSize = 5;
  const userID = useSelector(state => state.user.cognitoUsername);
  const {myPets, readyForCommunityFetch} = useSelector(state => state.user);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const [searchData, setSearchData] = useState({
    pets: [],
    nextToken: null,
  });
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  console.log(
    'print my pets in community page: ',
    myPets.length,
    readyForCommunityFetch,
  );

  useEffect(() => {
    navigation.popToTop();
    const firstFetch = async () => {
      await fetchPets();
      setIsFetchComplete(true);
    };
    if (readyForCommunityFetch) {
      firstFetch();
      console.log('community first fetched pets is done!');
    }
  }, []);

  const fetchPets = async () => {
    const inputVariables = {
      accessLevel: 'Public',
      limit: pageSize,
      nextToken: petData.token,
    };
    queryPetsPagination(
      userID,
      petsByAccessLevel,
      inputVariables,
      isLoadingPets,
      setIsLoadingPets,
      myPets,
    ).then(data => {
      const {pets, nextToken: newNextToken} = data;
      setSearchData(prev => ({
        pets: [...prev.pets, ...pets],
        nextToken: newNextToken,
      }));
    });
  };

  const onEndReached = async () => {
    if (!isSearchActive) {
      if (petData.nextToken !== null) {
        await fetchPets();
      }
    } else {
      if (searchData.nextToken !== null) {
        await fetchSearchedPets();
      }
    }
  };

  const fetchSearchedPets = async petName => {
    const inputVariables = {
      name: petName,
      filter: {accessLevel: {eq: 'Public'}},
      limit: pageSize,
      nextToken: petData.token,
    };
    queryPetsPagination(
      userID,
      petByName,
      inputVariables,
      isLoadingPets,
      setIsLoadingPets,
      myPets,
    ).then(data => {
      const {pets, nextToken: newNextToken} = data;
      setPetData(prev => ({
        pets: [...prev.pets, ...pets],
        nextToken: newNextToken,
      }));
    });
  };

  const renderFlatList = useCallback(() => {
    // Determine if there's any data to display
    const hasData = petData.pets.length > 0 || searchData.pets.length > 0;

    if (!hasData) {
      return null;
    }
    return (
      <View style={styles.flatListContainer}>
        <FlatList
          data={isSearchActive ? searchData.pets : petData.pets}
          onMomentumScrollBegin={() => setIsLoadingPets(false)}
          onEndReachedThreshold={0.8}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <PetCard item={item} isFamily={false} />}
        />
      </View>
    );
  }, [petData.pets, searchData.pets, isSearchActive]);

  return (
    <SafeAreaView style={globalStyle.flex}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}>
        <SearchBox
          fetchSearchedPets={fetchSearchedPets}
          setIsSearchActive={setIsSearchActive}
        />
        {isFetchComplete && renderFlatList()}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  flatListContainer: {
    paddingTop: Dimensions.get('window').height * 0.02,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});
