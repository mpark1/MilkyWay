import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import {generateClient} from 'aws-amplify/api';
import {scaleFontSize} from '../../assets/styles/scaling';
import {getPet, getUser, petsByUser} from '../../graphql/queries';
import {useDispatch, useSelector} from 'react-redux';
import globalStyle from '../../assets/styles/globalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashedBorderButton from '../../components/Buttons/DashedBorderButton';
import PetCard from '../../components/PetCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchUser,
  fetchUserFromDB,
  getIdentityID,
  getUrlForProfilePic,
  mutationItemNoAlertBox,
  queryLettersByPetIDPagination,
  queryMyPetsPagination,
  querySingleItem,
  retrieveS3Url,
} from '../../utils/amplifyUtil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  setMyPets,
  setMyPetsFetchComplete,
  setOwnerDetails,
  setProfilePic,
  setUserProfilePic,
} from '../../redux/slices/User';
import * as RNFS from 'react-native-fs';
import {
  petPageTabsSubscription,
  sucriptionForMyPets,
} from '../../utils/amplifyUtilSubscription';
import {onCreateAlbum, onCreatePet} from '../../graphql/subscriptions';

const Pets = ({navigation}) => {
  const dispatch = useDispatch();
  const userID = useSelector(state => state.user.cognitoUsername);
  const email = useSelector(state => state.user.email);
  const [isFetchPetsComplete, setIsFetchPetsComplete] = useState(false);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const pageSize = 6;
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  /* 로그인한 사용자의 모든 반려동물(PetPage objects) 가져오기 */
  useEffect(() => {
    try {
      navigation.popToTop();
    } catch (error) {
      console.log('this is an error message for popToTop in Pets: ', error);
    }
    const firstFetchPet = async () => {
      await fetchPets();
      setIsFetchPetsComplete(true);
      console.log('is fetch pets complete? ', isFetchPetsComplete);
    };
    // if user info does not exist in redux, fetch user info again and save it in redux
    const fetchUser = async () => {
      console.log('does email exist? ', email);
      if (email.length === 0) {
        const response = await fetchUserFromDB(userID);
        dispatch(
          setOwnerDetails({
            name: response.name,
            email: response.email,
          }),
        );
        dispatch(setUserProfilePic(response.profilePic)); // update s3 key
        await retrieveS3Url(response.profilePic);
      }
    };
    firstFetchPet();
    fetchUser();
  }, []);

  useEffect(() => {
    const client = generateClient();
    try {
      return client
        .graphql({
          query: onCreatePet,
          variables: {filter: {managerID: {eq: userID}}},
          authMode: 'userPool',
        })
        .subscribe({
          next: ({data}) => processSubscriptionData(data.onCreatePet),
          error: error => console.warn(error),
        });
    } catch (error) {
      console.log('print error for subscription in Pets', error);
    }
  }, []);

  const processSubscriptionData = async petObject => {
    const newObjWithProfileUrl = await getUrlForProfilePic(petObject);
    console.log('print newly added pet data with profile pic url');
    setPetData(prev => ({
      ...prev,
      pets: [petObject, ...prev.pets],
    }));
  };

  const fetchPets = async () => {
    await queryMyPetsPagination(
      null,
      userID,
      isLoadingPets,
      setIsLoadingPets,
      pageSize,
      petData.nextToken,
    ).then(data => {
      const {pets, nextToken: newNextToken} = data;
      // dispatch my pets list to filter out these pets in community page
      pets.map(pet => dispatch(setMyPets(pet.id)));
      setPetData(prev => ({
        pets: [...prev.pets, ...pets],
        nextToken: newNextToken,
      }));
    });
    dispatch(setMyPetsFetchComplete(true));
  };

  const renderAddNewPetButton = useCallback(() => {
    return (
      // isFetchPetsComplete && (
      <View style={styles.addNewPetButtonContainer}>
        <DashedBorderButton
          type={'regular'}
          title={'새로운 추모공간 만들기'}
          circleSize={40}
          titleColor={'white'}
          onPress={() => navigation.navigate('AddNewPet')}
        />
      </View>
    );
    // );
  }, []);

  return (
    <SafeAreaView style={globalStyle.flex}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}>
        <View style={styles.icons}>
          <Pressable
            style={styles.settingsContainer}
            onPress={() => navigation.navigate('UserSettings')}>
            <Ionicons name={'settings-outline'} color={'#FFF'} size={20} />
            <Text style={styles.settings}>나의 계정 관리</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Notifications')}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color={'#FFF'}
            />
          </Pressable>
        </View>
        {isFetchPetsComplete && petData.pets.length > 0 && (
          <View style={styles.flatListContainer}>
            <FlatList
              data={petData.pets}
              renderItem={({item}) => <PetCard item={item} isFamily={true} />}
            />
          </View>
        )}
        {renderAddNewPetButton()}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Pets;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settings: {
    color: '#FFF',
    fontSize: scaleFontSize(16),
    marginLeft: 7,
    fontWeight: '600',
  },
  icons: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flatListContainer: {
    paddingTop: Dimensions.get('window').height * 0.02,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  addNewPetButtonContainer: {paddingHorizontal: 15, marginVertical: 15},
});
