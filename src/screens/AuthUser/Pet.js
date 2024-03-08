import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Pressable,
  Platform,
  NativeModules,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {StatusBarManager} = NativeModules;

const centerTab = createMaterialTopTabNavigator();

const Pet = ({navigation, route}) => {
  const {
    petID,
    profilePic,
    name,
    birthday,
    deathDay,
    lastWord,
    authorID,
    access,
  } = route.params;

  const renderManagerActionButtons = () => {
    return (
      <View style={styles.managerActionButtonsContainer}>
        <Ionicons name={'image-outline'} color={'#FFF'} size={24} />
        <Pressable>
          <SimpleLineIcons name={'envelope'} color={'#FFF'} size={24} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Ionicons name={'settings-outline'} color={'#FFF'} size={24} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.backgroundImageContainer}>
        <Image
          source={require('../../assets/images/milkyWayBackgroundImage.png')}
          style={styles.backgroundImage}
          resizeMode={'cover'}
        />
        {renderManagerActionButtons()}
      </View>
      <View style={styles.profileContainer}>
        <PetProfile name={name} birthday={birthday} deathDay={deathDay} />
      </View>

      <View style={styles.profilePicContainer}>
        <Image
          style={styles.profilePic}
          source={require('../../assets/images/cat.jpeg')}
        />
      </View>
      <centerTab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: scaleFontSize(18)},
          tabBarIndicatorStyle: {backgroundColor: '#FFF'},
          tabBarItemStyle: {
            width: Dimensions.get('window').width * 0.25,
            paddingHorizontal: 0,
          },
        }}>
        <centerTab.Screen
          name={'홈'}
          component={Home}
          initialParams={{
            lastWord: lastWord,
          }}
        />
        <centerTab.Screen name={'가족의 편지'} component={Letters} />
        <centerTab.Screen name={'앨범'} component={Album} />
        <centerTab.Screen name={'방명록'} component={GuestBook} />
      </centerTab.Navigator>
    </View>
  );
};

export default Pet;

const styles = StyleSheet.create({
  backgroundImageContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  managerActionButtonsContainer: {
    position: 'absolute',
    bottom: 7,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'space-between',
  },
  reportButtonContainer: {
    position: 'absolute',
    bottom: 7,
    right: 10,
    alignItems: 'center',
  },
  iconsWrapper: {
    position: 'absolute',
    bottom: 7,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    justifyContent: 'space-between',
  },
  profileContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.11,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 40,
  },
  profilePicContainer: {
    position: 'absolute',
    width: 150,
    height: 150,
    top: Dimensions.get('window').height * 0.12,
    left: Dimensions.get('window').width * 0.03,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 150 / 2,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editBackgroundImage: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? StatusBarManager.HEIGHT : 10,
    right: 10,
  },
});