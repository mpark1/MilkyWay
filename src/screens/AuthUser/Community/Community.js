import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import globalStyle from '../../../assets/styles/globalStyle';
import PetCard from '../../../components/PetCard';
import mockData from '../../../data/myMilkyWays.json';
// import {queryPetsPagination} from '../../../utils/amplifyUtil';
// import {useSelector} from 'react-redux';
import SearchBox from '../../../components/SearchBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scaleFontSize} from '../../../assets/styles/scaling';
// import {petByName} from '../../../graphql/queries';

const Community = ({navigation}) => {
  const pageSize = 5;
  // const userID = useSelector(state => state.user.cognitoUsername);
  // const {myPets, readyForCommunityFetch, gender} = useSelector(state => state.user);
  const gender = useState(-1); // female or male, 0 or 1?
  const [petData, setPetData] = useState({
    pets: [
      {
        name: '벤지',
        birthday: '2013-08-23',
        deathDay: '2023-11-24',
        lastWord: '사랑하는 벤지 이곳에 잠들다',
      },
      {
        name: '토순이',
        birthday: '2019-03-17',
        deathDay: '2024-01-05',
        lastWord: '토순이 달나라 여행 중',
        imagePath: 'bunny.png',
      },
      {
        name: '코코',
        birthday: '2015-03-24',
        deathDay: '2023-12-11',
        lastWord: '천사같은 코코 이제 편히 잠들길...',
      },
      {
        name: '나비',
        birthday: '2002-11-02',
        deathDay: '2017-11-08',
        lastWord: '영원히 기억될 나비',
      },
    ],
    nextToken: null,
  });
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(true);
  // console.log(
  //   'print my pets in community page: ',
  //   myPets.length,
  //   readyForCommunityFetch,
  // );

  // useEffect(() => {
  //   navigation.popToTop();
  //   const firstFetch = async () => {
  //     await fetchPets();
  //     setIsFetchComplete(true);
  //   };
  //   if (readyForCommunityFetch) {
  //     firstFetch();
  //     console.log('community first fetched pets is done!');
  //   }
  // }, []);
  //
  // const fetchPets = async () => {
  //  const inputVariables = {
  //           accessLevel: 'Public',
  //           limit: pageSize,
  //           nextToken: petData.token,
  //         }
  //   queryPetsPagination(
  //     userID,
  //      petsByAccessLevel,
  //      inputVariables,
  //     isLoadingPets,
  //     setIsLoadingPets,
  //     myPets,
  //   ).then(data => {
  //     const {pets, nextToken: newNextToken} = data;
  //     setPetData(prev => ({
  //       pets: [...prev.pets, ...pets],
  //       nextToken: newNextToken,
  //     }));
  //   });
  // };

  const onEndReached = async () => {
    // if (petData.nextToken !== null) {
    //   await fetchPets();
    // }
  };

  // const fetchSearchedPets = async petName => {
  //   const inputVariables = {
  //     name: petName,
  //     filter: {accessLevel: {eq: 'Public'}},
  //     limit: pageSize,
  //     nextToken: petData.token,
  //   };
  //   queryPetsPagination(
  //     userID,
  //     petByName,
  //     inputVariables,
  //     isLoadingPets,
  //     setIsLoadingPets,
  //     myPets,
  //   ).then(data => {
  //     const {pets, nextToken: newNextToken} = data;
  //     setPetData(prev => ({
  //       pets: [...prev.pets, ...pets],
  //       nextToken: newNextToken,
  //     }));
  //   });
  // };

  const checkGenderInfoAndNavigate = () => {
    gender === -1
      ? navigation.navigate('TesteeInfo')
      : navigation.navigate('Questions');
  };

  return (
    <SafeAreaView style={globalStyle.flex}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}>
        <Pressable
          style={styles.psychTest}
          onPress={() => {
            // check gender
            // gender === null? testeeInfo, otherwise navigate to screen 'PBQ'
            // 한 유저가 두번째 심리테스트를 다른 반려동물을 잃은 것에 대해서 심리 테스트 할 경우는?
            navigation.navigate('TesteeInfo');
          }}>
          <Text style={styles.psychTestText}>심리 검사 테스트 </Text>
        </Pressable>
        <View style={styles.searchIconContainer}>
          <Pressable
            style={styles.searchIcon}
            onPress={() => navigation.navigate('SearchPets')}>
            <Ionicons name={'search'} color={'#FFF'} size={24} />
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
              renderItem={({item, index}) => (
                <>
                  <PetCard
                    name={item.name}
                    birthday={item.birthday}
                    deathDay={item.deathDay}
                    lastWord={item.lastWord}
                    number={index}
                    isFamily={false}
                  />
                </>
              )}
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
    width: '95%',
    height: 70,
    marginVertical: 10,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    opacity: 0.9,
  },
  psychTestText: {
    fontSize: scaleFontSize(24),
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
