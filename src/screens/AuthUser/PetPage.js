import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import PetProfile from '../../components/PetProfile';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Home from './CenterTabs/Home';
import Letters from './CenterTabs/Letters';
import Album from './CenterTabs/Album';
import GuestBook from './CenterTabs/GuestBook';
import {scaleFontSize} from '../../assets/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  checkS3UrlForOthers,
  mutationItem,
  retrieveS3UrlForOthers,
  updateProfilePic,
} from '../../utils/amplifyUtil';
import {
  setUpdateProfilePicUrl,
  setNewBackgroundPicS3Key,
  setNewBackgroundPicUrl,
} from '../../redux/slices/Pet';
import SinglePictureBottomSheetModal from '../../components/SinglePictureBottomSheetModal';
import {updatePet, updatePetPageBackgroundImage} from '../../graphql/mutations';

const centerTab = createMaterialTopTabNavigator();

const PetPage = ({navigation, route}) => {
  const isFamily = route.params.isFamily; //true or false
  const {
    id,
    name,
    birthday,
    deathday,
    lastWord,
    accessLevel,
    manager,
    profilePic,
    s3UrlExpiredAt,
    profilePicS3Key,
    backgroundPic, // original background picture url if any
    backgroundPicS3Key,
    backgroundPicS3UrlExpiredAt,
    identityId,
  } = useSelector(state => state.pet);
  const dispatch = useDispatch();

  const [newBackgroundPic, setNewBackgroundPic] = useState(backgroundPic);
  const bottomSheetModalRef = useRef(null);
  const [isCallingUpdateAPI, setIsCallingUpdateAPI] = useState(false);

  // subscription to be added

  useEffect(() => {
    console.log('this is PetPAge. print redux: ', name, manager);
    //check pet's profile and background picture url expiration once when the page is loaded.
    profilePic.length !== 0 && checkS3urlFunc('profilePic');
    backgroundPic.length !== 0 && checkS3urlFunc('backgroundPic');
  }, []);

  useEffect(() => {
    if (newBackgroundPic !== backgroundPic) {
      Alert.alert(
        '배경사진 미리보기',
        '선택된 사진으로 변경을 진행하시겠습니까?',
        [
          {
            text: '취소',
            onPress: () => {
              setNewBackgroundPic(backgroundPic);
            },
          },
          {
            text: '네',
            onPress: () => onUpdateBackgroundPic(),
          },
        ],
      );
    }
  }, [newBackgroundPic]);

  const onUpdateBackgroundPic = async () => {
    // 1. S3
    const newS3key = await updateProfilePic(
      newBackgroundPic, // new local path
      'petBackground',
      backgroundPicS3Key, // current
    );
    console.log('New background pic s3key: ', newS3key);

    // 2. DB
    await mutationItem(
      isCallingUpdateAPI,
      setIsCallingUpdateAPI,
      {
        petID: id,
        backgroundImageKey: 'petProfile/' + newS3key,
      },
      updatePetPageBackgroundImage,
      '배경사진이 성공적으로 변경되었습니다',
      'none',
    );

    // 3. Redux
    const res = await retrieveS3UrlForOthers(
      'petProfile/' + newS3key,
      identityId,
    );
    dispatch(setNewBackgroundPicS3Key('petProfile/' + newS3key));
    dispatch(
      setNewBackgroundPicUrl({
        backgroundPic: res.url.href,
        backgroundPicS3UrlExpiredAt: res.expiresAt.toString(),
      }),
    );
  };

  const renderBackgroundImage = () => {
    // TODO: 배경사진 가로, 세로 비율 (aspectRatio)
    return newBackgroundPic.length === 0 ? (
      <Image
        source={require('../../assets/images/milkyWayBackgroundImage.png')}
        style={styles.backgroundImage}
        resizeMode={'cover'}
      />
    ) : (
      <Image
        source={{uri: newBackgroundPic}}
        style={styles.backgroundImage}
        resizeMode={'cover'}
      />
    );
  };

  const renderManagerActionButtons = () => {
    return (
      <View style={styles.iconsWrapper}>
        <Pressable onPress={() => bottomSheetModalRef.current?.present()}>
          <Ionicons name={'image-outline'} color={'#FFF'} size={24} />
        </Pressable>
        <Pressable>
          <SimpleLineIcons name={'envelope'} color={'#FFF'} size={24} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Ionicons name={'settings-outline'} color={'#FFF'} size={24} />
        </Pressable>
      </View>
    );
  };

  const renderProfilePic = () => {
    return (
      <View style={styles.profilePicContainer}>
        {profilePic.length > 0 ? (
          <Image
            style={styles.profilePic}
            source={{
              uri: profilePic,
            }}
            resizeMode={'cover'}
          />
        ) : (
          <Image
            style={styles.profilePic}
            source={require('../../assets/images/default_pet_profilePic.jpg')}
            resizeMode={'cover'}
          />
        )}
      </View>
    );
  };

  const checkS3urlFunc = async type => {
    if (type === 'profilePic') {
      const res = await checkS3UrlForOthers(
        'petProfilePic',
        s3UrlExpiredAt,
        profilePicS3Key,
        identityId,
      );
      if (res !== null) {
        dispatch(setUpdateProfilePicUrl(res));
      }
    } else {
      const res = await checkS3UrlForOthers(
        'petBackground',
        backgroundPicS3UrlExpiredAt,
        backgroundPicS3Key,
        identityId,
      );
      if (res !== null) {
        dispatch(setNewBackgroundPicUrl(res));
      }
    }
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.backgroundImageContainer}>
        {renderBackgroundImage()}
        {manager && renderManagerActionButtons()}
      </View>
      <View style={styles.profileContainer}>
        <PetProfile name={name} birthday={birthday} deathday={deathday} />
      </View>
      {renderProfilePic()}
      <centerTab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: scaleFontSize(18)},
          tabBarIndicatorStyle: {backgroundColor: '#6395E1'},
          tabBarItemStyle: {
            width: Dimensions.get('window').width * 0.25,
            paddingHorizontal: 0,
          },
          lazy: true,
        }}>
        <centerTab.Screen name={'홈'} component={Home} />
        <centerTab.Screen
          name={'가족의 편지'}
          component={Letters}
          initialParams={{
            isFamily: isFamily,
          }}
        />
        <centerTab.Screen
          name={'앨범'}
          component={Album}
          initialParams={{
            isFamily: isFamily,
          }}
        />
        <centerTab.Screen
          name={'방명록'}
          component={GuestBook}
          initialParams={{
            isFamily: isFamily,
          }}
        />
      </centerTab.Navigator>
      <SinglePictureBottomSheetModal
        bottomSheetModalRef={bottomSheetModalRef}
        setPicture={setNewBackgroundPic}
        setPictureUrl={''}
        type={'updatePetPageBackground'}
      />
    </View>
  );
};

export default PetPage;

const styles = StyleSheet.create({
  backgroundImageContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.15,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  iconsWrapper: {
    position: 'absolute',
    bottom: 7,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'space-between',
  },
  profileContainer: {
    width: '100%',
    height: 100,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 40,
  },
  profilePicContainer: {
    position: 'absolute',
    width: 130,
    height: 130,
    top: Dimensions.get('window').height * 0.1,
    left: Dimensions.get('window').width * 0.03,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#FFF',
  },
});
