import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
// import {useSelector} from 'react-redux';
import {Button} from '@rneui/themed';
// import {petByName} from '../graphql/queries';
// import {queryPetsPagination} from '../utils/amplifyUtil';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';
import PetCard from '../../../components/PetCard';
import SearchBox from '../../../components/SearchBox';

const SearchPets = () => {
  // const userID = useSelector(state => state.user.cognitoUsername);
  // const {myPets} = useSelector(state => state.user);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(true);

  const fetchSearchedPets = async petName => {
    setIsFetchComplete(false);

    const inputVariables = {
      name: petName,
      filter: {accessLevel: {eq: 'Public'}},
      limit: 5,
      nextToken: petData.token,
    };
    // queryPetsPagination(
    //   userID,
    //   petByName,
    //   inputVariables,
    //   isLoadingPets,
    //   setIsLoadingPets,
    //   myPets,
    // ).then(data => {
    //   const {pets, nextToken: newNextToken} = data;
    //   setPetData(prev => ({
    //     pets: [...prev.pets, ...pets],
    //     nextToken: newNextToken,
    //   }));
    //   setIsFetchComplete(true);
    // });
  };

  const onEndReached = async () => {
    if (petData.nextToken !== null) {
      await fetchSearchedPets();
    }
  };

  const renderFlatList = useCallback(() => {
    // TODO: 검색 결과 없을 때 보여줄 문구, 로직 추가
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
        ) : null}
      </View>
    );
  }, [petData.pets]);

  return (
    <SafeAreaView
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      <View style={styles.searchBoxAndButtonContainer}>
        <SearchBox
          fetchSearchedPets={fetchSearchedPets}
          isFetchComplete={isFetchComplete}
        />
      </View>
      {!isFetchComplete ? (
        <ActivityIndicator style={styles.activityIndicator} />
      ) : (
        renderFlatList()
      )}
    </SafeAreaView>
  );
};

export default SearchPets;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: Dimensions.get('window').width * 0.07,
    alignItems: 'center',
  },
  searchBoxAndButtonContainer: {
    flexDirection: 'row',
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
