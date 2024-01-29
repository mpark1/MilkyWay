import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import {scaleFontSize} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import PetCard from '../../../components/PetCard';
import {queryPetsPagination} from '../../../utils/amplifyUtil';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '@rneui/themed';

const Community = ({navigation}) => {
  const pageSize = 5;
  const userID = useSelector(state => state.user.cognitoUsername);
  const {myPets, readyForCommunityFetch} = useSelector(state => state.user);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const [petName, setPetName] = useState('');
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);
  console.log(
    'print my pets in community page: ',
    myPets.length,
    readyForCommunityFetch,
  );

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
  //   queryPetsPagination(
  //     userID,
  //     isLoadingPets,
  //     setIsLoadingPets,
  //     pageSize,
  //     petData.token,
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

  return (
    <SafeAreaView style={globalStyle.flex}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.textInput}
            placeholder={'동물 이름 찾기'}
            placeholderTextColor={'#939393'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={text => {
              setPetName(text);
            }}
          />
          <Ionicons
            style={styles.searchIcon}
            name={'search'}
            color={'#373737'}
            size={24}
          />
          <Button
            title="검색"
            type="solid"
            titleStyle={styles.buttonTitleStyle}
            buttonStyle={styles.buttonBackgroundColor}
            containerStyle={styles.buttonContainer}
            onPress={() => {}}
          />
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
  flatListContainer: {
    paddingTop: Dimensions.get('window').height * 0.02,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  textInput: {
    width: '83%',
    height: '95%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 5,
    paddingLeft: 35,
    color: '#000000',
    fontSize: scaleFontSize(18),
    fontWeight: '500',
    alignSelf: 'center',
  },
  searchBox: {
    paddingVertical: 8,
    height: Dimensions.get('window').height * 0.09,
    width: Dimensions.get('window').width * 0.93,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchIcon: {
    position: 'absolute',
    left: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    borderRadius: 10,
  },
  buttonTitleStyle: {
    color: '#FFF',
    fontSize: scaleFontSize(18),
  },
  buttonBackgroundColor: {
    backgroundColor: '#939393',
  },
});
