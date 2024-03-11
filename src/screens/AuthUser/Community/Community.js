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
import AntDesign from 'react-native-vector-icons/AntDesign';

const Community = ({navigation}) => {
  const pageSize = 5;
  const {myPets, readyForCommunityFetch, gender} = useSelector(
    state => state.user,
  );
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

  const handlePBQTestNavigation = () => {
    if (gender === -1) {
      navigation.navigate('TesteeInfo');
    } else {
      // 진단 횟수 몇 미만이면 가장 최근 '테스트 준비' 기입 내용 db에서 가져오기 -> navigation.navigate('PBQ');
      // 진단 횟수 몇 이상이면 Alert
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
          <Pressable
            // onPress={handlePBQTestNavigation}
            onPress={() => navigation.navigate('TesteeInfo')}>
            <Text style={styles.psychTestText}>심리 테스트</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.psychTestSubText}>
                내 마음상태 점검하러 가기
              </Text>
              <AntDesign
                name={'arrowright'}
                size={scaleFontSize(20)}
                color={'#FFF'}
              />
            </View>
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
    width: Dimensions.get('window').width * 0.93,
    height: 70,
    backgroundColor: '#B6B02C',
    opacity: 0.9,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  psychTestText: {
    fontSize: scaleFontSize(20),
    marginLeft: 10,
    marginBottom: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
  psychTestSubText: {
    fontSize: scaleFontSize(18),
    marginHorizontal: 10,
    color: '#FFF',
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
