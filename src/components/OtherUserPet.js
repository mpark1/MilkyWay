/*
 * 내용 - 다른 유저의 동물의 사진과 이름을 감싼 컴포넌트
 * 목적 - 사진이나 이름 클릭 시 해당 동물의 추모공간 (PetPage)로 이동함
 * */
import React from 'react';
import {StyleSheet, Pressable, View, Image, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {scaleFontSize} from '../assets/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  setIsManager,
  setNewBackgroundPicS3Key,
  setNewBackgroundPicUrl,
  setPetGeneralInfo,
} from '../redux/slices/Pet';
import {querySingleItem, retrieveS3UrlForOthers} from '../utils/amplifyUtil';
import {getPetpageBackgroundImage} from '../graphql/queries';

// TODO: AddNewPet에서 이름 maxLength 정하고 OtherUserPet 수정해야 함
const OtherUserPet = ({item, bottomSheetRef, navigation}) => {
  const userID = useSelector(state => state.user.cognitoUsername);
  const dispatch = useDispatch();

  const onClickPet = async () => {
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
        identityId: item.identityId,
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

    bottomSheetRef.current?.close();
    navigation.pop();
    navigation.navigate('PetPage', {isFamily: false});
  };

  return (
    <Pressable onPress={onClickPet} style={styles.pet}>
      <View style={styles.profilePicContainer}>
        {item.profilePic.length > 0 ? (
          <Image
            style={styles.profilePic}
            source={{
              uri: item.profilePic,
            }}
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
      <View style={styles.nameAndStarContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Ionicons name={'star-outline'} color={'#374957'} size={18} />
      </View>
    </Pressable>
  );
};

export default OtherUserPet;

const styles = StyleSheet.create({
  pet: {
    marginRight: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  profilePicContainer: {
    height: 70,
    width: 70,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  nameAndStarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: scaleFontSize(18),
    color: '#374957',
  },
});
