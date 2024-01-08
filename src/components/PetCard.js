import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentPetID} from '../redux/slices/User';
import {
  resetPet,
  setIsManager,
  setPetGeneralInfo,
  setPetID,
} from '../redux/slices/Pet';

const PetCard = ({item, isFamily}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userID = useSelector(state => state.user.cognitoUsername);
  const {
    id,
    profilePic,
    name,
    birthday,
    deathDay,
    lastWord,
    accessLevel,
    owner,
  } = item;

  const onSubmit = () => {
    // reset pet redux slice
    dispatch(resetPet());
    // update pet redux
    dispatch(
      setPetGeneralInfo({
        id: id,
        name: name,
        birthday: birthday,
        deathday: deathDay,
        profilePic: profilePic,
        lastWord: lastWord,
        accessLevel: accessLevel,
      }),
    );
    dispatch(setIsManager(owner === userID));
    console.log('is user an owner of the selected pet? ', owner === userID);
    navigation.navigate('PetPage', {isFamily: isFamily});
  };

  return (
    <Pressable
      onPress={() => {
        onSubmit();
      }}>
      <View style={styles.lowOpacityCard} />
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          paddingHorizontal: 10,
          paddingVertical: '5%',
          alignItems: 'center',
        }}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={{uri: profilePic}}
            resizeMode={'cover'}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameAndStarContainer}>
            <Text style={styles.name}>{name}</Text>
            <Ionicons name={'star-outline'} color={'#000'} size={15} />
          </View>

          <View style={styles.datesContainer}>
            <Text style={styles.dates}>
              생일{'     '}
              {birthday}
            </Text>
            <Text style={[styles.dates, {lineHeight: scaleFontSize(24)}]}>
              기일{'     '}
              {deathDay}
            </Text>
          </View>

          <Text
            style={styles.lastWords}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {lastWord}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PetCard;

const styles = StyleSheet.create({
  lowOpacityCard: {
    backgroundColor: '#ededed',
    borderRadius: 5,
    opacity: 0.7,
    width: Dimensions.get('window').width * 0.93,
    height: 126,
    marginBottom: 20,
  },
  profilePicContainer: {
    width: 90,
    height: 90,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  infoContainer: {
    flex: 1,
    marginLeft: Dimensions.get('window').width * 0.04,
  },
  nameAndStarContainer: {flexDirection: 'row', alignItems: 'center'},
  name: {fontSize: scaleFontSize(18), color: '#000'},
  datesContainer: {
    marginVertical: 7,
  },
  dates: {
    fontSize: scaleFontSize(16),
    color: '#494444',
  },
  lastWords: {fontSize: scaleFontSize(16), color: '#494444'},
});
