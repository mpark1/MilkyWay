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
import {useDispatch, useSelector} from 'react-redux';
import globalStyle from '../../assets/styles/globalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashedBorderButton from '../../components/Buttons/DashedBorderButton';
import PetCard from '../../components/PetCard';
import {
  checkAdmin,
  fetchUserFromDB,
  getUrlForProfilePic,
  queryMyPetsPagination,
  retrieveS3Url,
} from '../../utils/amplifyUtil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  setIsAdmin,
  setMyPets,
  setMyPetsFetchComplete,
  setOwnerDetails,
  setUserProfilePic,
  setUserProfilePicS3Key,
} from '../../redux/slices/User';
import {
  petPageTabsSubscription,
  sucriptionForMyPets,
} from '../../utils/amplifyUtilSubscription';
import {
  onCreatePet,
  onDeletePetFamily,
  onUpdatePet,
} from '../../graphql/subscriptions';

const Pets = ({navigation}) => {
  const dispatch = useDispatch();
  const userID = useSelector(state => state.user.cognitoUsername);
  const email = useSelector(state => state.user.email);
  const isAdmin = useSelector(state => state.user.isAdmin);
  const [isFetchPetsComplete, setIsFetchPetsComplete] = useState(false);
  const [petData, setPetData] = useState({
    pets: [],
    nextToken: null,
  });
  const pageSize = 6;
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  /* 로그인한 사용자의 모든 반려동물(PetPage objects) 가져오기 */
  useEffect(() => {
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
        dispatch(setUserProfilePicS3Key(response.profilePic)); // update s3 key
        await retrieveS3Url(response.profilePic).then(res => {
          console.log('print user profile pic url', res.url.href);
          dispatch(
            setUserProfilePic({
              profilePic: res.url.href,
              s3UrlExpiredAt: res.expiresAt.toString(),
            }),
          );
        });
      }
    };
    const checkIfAdmin = async () => {
      await checkAdmin().then(res => dispatch(setIsAdmin(res)));
    };
    firstFetchPet();
    fetchUser();
    checkIfAdmin();
  }, []);

  useEffect(() => {
    const client = generateClient();
    const createPetSub = client
      .graphql({
        query: onCreatePet,
        variables: {filter: {managerID: {eq: userID}}},
        authMode: 'userPool',
      })
      .subscribe({
        next: ({data}) => processSubscriptionData('create', data.onCreatePet),
        error: error => console.warn(error),
      });

    const updatePetSub = client
      .graphql({
        query: onUpdatePet,
        variables: {filter: {managerID: {eq: userID}}},
        authMode: 'userPool',
      })
      .subscribe({
        next: ({data}) => processSubscriptionData('update', data.onUpdatePet),
        error: error => console.warn(error),
      });

    const deletePetSub = client
      .graphql({
        query: onDeletePetFamily,
        variables: {filter: {familyMemberID: {eq: userID}}},
        authMode: 'userPool',
      })
      .subscribe({
        next: ({data}) =>
          processSubscriptionData('delete', data.onDeletePetFamily),
        error: error => console.warn(error),
      });

    console.log(
      'create, update, delete my pets subscriptions are on for Pets.js',
    );

    return () => {
      console.log('My pets subscriptions are turned off!');
      createPetSub.unsubscribe();
      updatePetSub.unsubscribe();
      deletePetSub.unsubscribe();
    };
  }, []);

  const processSubscriptionData = async (type, petObject) => {
    switch (type) {
      case 'create':
        const newObjWithProfileUrl = await getUrlForProfilePic(petObject);
        console.log(
          'print newly added pet data with profile pic url',
          newObjWithProfileUrl,
        );
        setPetData(prev => ({
          ...prev,
          pets: [newObjWithProfileUrl, ...prev.pets],
        }));
        break;

      case 'update':
        const updatedPetObjWithProfileUrl = await getUrlForProfilePic(
          petObject,
        );
        const updatedPets = petData.pets.map(pet => {
          if (pet.id === petObject.id) {
            return updatedPetObjWithProfileUrl;
          }
          return pet;
        });
        setPetData(prev => ({
          ...prev,
          pets: updatedPets,
        }));
        break;

      case 'delete':
        setPetData(prev => ({
          ...prev,
          pets: prev.pets.filter(pet => pet.id !== petObject.petID),
        }));
        break;
    }
  };

  const fetchPets = async () => {
    await queryMyPetsPagination(
      userID,
      isLoadingPets,
      setIsLoadingPets,
      pageSize,
      petData.nextToken,
      null,
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
          {isAdmin && (
            <Pressable
              style={styles.settingsContainer}
              onPress={() => navigation.navigate('AdminPage')}>
              <Ionicons name={'settings-outline'} color={'#FFF'} size={20} />
              <Text style={styles.settings}>관리자 페이지</Text>
            </Pressable>
          )}
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
