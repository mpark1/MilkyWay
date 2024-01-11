import React, {useEffect} from 'react';
import {Dimensions, Image, Pressable, StyleSheet, View} from 'react-native';
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
import {checkS3Url} from '../../utils/amplifyUtil';
import {setUpdateProfilePicUrl} from '../../redux/slices/Pet';

const centerTab = createMaterialTopTabNavigator();

const PetPage = ({navigation, route}) => {
  const isFamily = route.params.isFamily; //true or false
  const {
    name,
    birthday,
    deathday,
    manager,
    profilePic,
    s3UrlExpiredAt,
    profilePicS3Key,
  } = useSelector(state => state.pet);
  const dispatch = useDispatch();

  useEffect(() => {
    //check user's profile picture url expiration once when the page is loaded.
    checkS3urlFunc();
  }, []);

  const renderBellEnvelopeSettingsIcons = () => {
    // 매니저일 경우에만 보여주기
    return (
      <View style={styles.iconsWrapper}>
        <Pressable>
          <SimpleLineIcons name={'envelope'} color={'#FFF'} size={24} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Ionicons name={'settings-outline'} color={'#FFF'} size={24} />
        </Pressable>
      </View>
    );
  };

  const checkS3urlFunc = async () => {
    const newProfileUrl = await checkS3Url(s3UrlExpiredAt, profilePicS3Key);
    if (newProfileUrl.length !== 0) {
      dispatch(setUpdateProfilePicUrl(newProfileUrl));
    }
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.backgroundImageContainer}>
        <Image
          source={require('../../assets/images/milkyWayBackgroundImage.png')}
          style={styles.backgroundImage}
          resizeMode={'cover'}
        />
        {manager && renderBellEnvelopeSettingsIcons()}
      </View>
      <View style={styles.profileContainer}>
        <PetProfile name={name} birthday={birthday} deathday={deathday} />
      </View>

      <View style={styles.profilePicContainer}>
        <Image
          style={styles.profilePic}
          source={{
            uri: profilePic,
          }}
          resizeMode={'cover'}
        />
      </View>
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
    width: 60,
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
