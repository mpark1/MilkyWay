import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {scaleFontSize} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import PetCard from '../../../components/PetCard';
import {queryPetsPagination} from '../../../utils/amplifyUtil';
import {useSelector} from 'react-redux';

const Community = ({navigation}) => {
  const pageSize = 5;
  const userID = useSelector(state => state.user.cognitoUsername);
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
    queryPetsPagination(
      userID,
      isLoadingPets,
      setIsLoadingPets,
      pageSize,
      petData.token,
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
      await fetchPets();
    }
  };

  return (
    <SafeAreaView style={globalStyle.flex}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}>
        <Text>추모공간 커뮤니티에 오신것을 환영합니다.</Text>
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
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 10,
  },
  settings: {
    color: '#FFF',
    fontSize: scaleFontSize(14),
    marginLeft: 7,
    fontWeight: '600',
  },
  flatListContainer: {
    paddingTop: Dimensions.get('window').height * 0.02,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});
