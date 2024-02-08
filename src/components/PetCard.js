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
  setNewBackgroundPicS3Key,
  setNewBackgroundPicUrl,
  setPetGeneralInfo,
  setPetID,
} from '../redux/slices/Pet';
import {querySingleItem, retrieveS3UrlForOthers} from '../utils/amplifyUtil';
import {getPetpageBackgroundImage} from '../graphql/queries';

const PetCard = ({item, isFamily}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userID = useSelector(state => state.user.cognitoUsername);

  const onSubmit = async () => {
    // update pet redux
    dispatch(
      setPetGeneralInfo({
        id: item.id,
        name: item.name,
        birthday: item.birthday,
        deathday: item.deathDay,
        profilePic: item.profilePic,
        lastWord: item.lastWord,
        accessLevel: item.accessLevel,
        profilePicS3Key: item.profilePicS3Key,
        s3UrlExpiredAt: item.s3UrlExpiredAt,
        petType: item.petType,
        identityId: item.identityId,
        deathCause: item.deathCause,
      }),
    );
    dispatch(setIsManager(item.owner === userID));

    await querySingleItem(getPetpageBackgroundImage, {petID: item.id}).then(
      async resFromDB => {
        console.log('does the pet have background image?', resFromDB);
        const obj = resFromDB.getPetpageBackgroundImage;
        if (obj !== null) {
          if (obj.backgroundImageKey.length > 0) {
            const s3key = obj.backgroundImageKey;
            dispatch(setNewBackgroundPicS3Key(s3key));

            const getUrlResult = await retrieveS3UrlForOthers(
              s3key,
              item.identityId,
            );
            dispatch(
              setNewBackgroundPicUrl({
                backgroundPic: getUrlResult.url.href,
                backgroundPicS3UrlExpiredAt: getUrlResult.expiresAt.toString(),
              }),
            );
          }
        }
      },
    );

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
          {item.profilePic.length > 0 ? (
            <Image
              style={styles.profilePic}
              source={{uri: item.profilePic}}
              resizeMode={'cover'}
            />
          ) : (
            <Image
              style={styles.profilePic}
              source={require('../assets/images/default_pet_profilePic.jpg')}
              resizeMode={'cover'}
            />
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameAndStarContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Ionicons name={'star-outline'} color={'#000'} size={15} />
          </View>

          <View style={styles.datesContainer}>
            <Text style={styles.dates}>
              생일{'     '}
              {item.birthday}
            </Text>
            <Text style={[styles.dates, {lineHeight: scaleFontSize(24)}]}>
              기일{'     '}
              {item.deathDay}
            </Text>
          </View>

          <Text
            style={styles.lastWords}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item.lastWord}
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
