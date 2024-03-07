import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
import {petsByAccessLevel} from '../../../graphql/queries';
import {queryPetsPagination} from '../../../utils/amplifyUtil';
import PetCard from '../../../components/PetCard';
import globalStyle from '../../../assets/styles/globalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scaleFontSize} from '../../../assets/styles/scaling';

const Community = ({navigation}) => {
  const pageSize = 5;
  const {myPets, readyForCommunityFetch} = useSelector(state => state.user);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);

  useEffect(() => {
    const firstFetch = async () => {
      try {
        await fetchPets();
      } catch (e) {
        console.log('print fetch error in Community.js');
      } finally {
        setIsFetchComplete(true);
      }
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
      nextToken: petData.nextToken,
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
    });
  };

  const onEndReached = async () => {
    if (petData.nextToken !== null) {
      console.log('print: onEndReached for Community.js. Inside if statement');
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
        <View style={styles.psychTest}>
          <Pressable onPress={() => navigation.navigate('TestResult')}>
            <Text style={styles.psychTestText}>
              심리 검사 테스트 (개발 예정)
            </Text>
          </Pressable>
        </View>
        {isFetchComplete && petData.pets.length > 0 && (
          <View style={styles.flatListContainer}>
            <FlatList
              onMomentumScrollBegin={() => setIsLoadingPets(false)}
              onEndReachedThreshold={0.2}
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
  psychTest: {
    width: '90%',
    height: 70,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  psychTestText: {
    fontSize: scaleFontSize(25),
    textAlign: 'center',
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
