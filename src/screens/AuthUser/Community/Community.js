import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {scaleFontSize} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import PetCard from '../../../components/PetCard';
import {queryPetsPagination} from '../../../utils/amplifyUtil';

const Community = ({navigation}) => {
  const pageSize = 5;
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);

  useEffect(() => {
    const firstFetch = async () => {
      await fetchPets();
      setIsFetchComplete(true);
    };
    firstFetch();
    console.log('first fetched pets is done!');
  }, []);

  const fetchPets = async () => {
    queryPetsPagination(
      isLoadingPets,
      setIsLoadingPets,
      pageSize,
      petData.token,
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
      {isFetchComplete && petData.pets.length > 0 && (
        <ImageBackground
          style={styles.backgroundImage}
          source={require('../../../assets/images/milkyWayBackgroundImage.png')}
          resizeMode={'cover'}>
          <View style={styles.flatListContainer}>
            <FlatList
              onMomentumScrollBegin={() => setIsLoadingPets(false)}
              onEndReachedThreshold={0.8}
              onEndReached={onEndReached}
              showsVerticalScrollIndicator={false}
              data={petData.pets}
              renderItem={({item}) => (
                <PetCard
                  petID={item.id}
                  profilePic={item.profilePic}
                  name={item.name}
                  birthday={item.birthday}
                  deathDay={item.deathDay}
                  lastWord={item.lastWord}
                  isFamily={false}
                />
              )}
            />
          </View>
        </ImageBackground>
      )}
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
