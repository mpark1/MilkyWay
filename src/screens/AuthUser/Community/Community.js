import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {petsByAccessLevel} from '../../../graphql/queries';
import {queryPetsPagination} from '../../../utils/amplifyUtil';
import PetCard from '../../../components/PetCard';
import globalStyle from '../../../assets/styles/globalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Community = ({navigation}) => {
  const pageSize = 5;
  const {myPets, readyForCommunityFetch} = useSelector(state => state.user);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);
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
    setIsFetchComplete(false);
    const inputVariables = {
      accessLevel: 'Public',
      limit: pageSize,
      nextToken: petData.token,
    };
    queryPetsPagination(
      petsByAccessLevel,
      'petsByAccessLevel',
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
      setIsFetchComplete(true);
    });
  };

  const onEndReached = async () => {
    if (petData.nextToken !== null) {
      await fetchPets();
    }
  };

  return (
    <SafeAreaView style={globalStyle.flex}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}>
        <View style={styles.searchIconContainer}>
          <Pressable
            style={styles.searchIcon}
            onPress={() => navigation.navigate('SearchPets')}>
            <Ionicons name={'search'} color={'#FFF'} size={22} />
          </Pressable>
        </View>
        {isFetchComplete && petData.pets.length > 0 && (
          <View style={styles.flatListContainer}>
            <FlatList
              onMomentumScrollBegin={() => setIsLoadingPets(false)}
              onEndReachedThreshold={0.8}
              onEndReached={onEndReached}
              showsVerticalScrollIndicator={false}
              data={petData.pets}
              renderItem={({item}) => <PetCard item={item} isFamily={false} />}
            />
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  searchIconContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingTop: Dimensions.get('window').height * 0.01,
    paddingRight: Dimensions.get('window').width * 0.03,
  },
  searchIcon: {
    alignSelf: 'flex-end',
  },
  flatListContainer: {
    paddingTop: Dimensions.get('window').height * 0.02,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});
