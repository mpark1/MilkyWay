import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
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

  const renderBellEnvelopeSettingsIcons = () => {
    return (
      <View style={styles.iconsWrapper}>
        <Pressable onPress={() => navigation.navigate('Notifications')}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={24}
            color={'#FFF'}
          />
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

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.backgroundImageContainer}>
        <Image
          source={require('../../assets/images/milkyWayBackgroundImage.png')}
          style={styles.backgroundImage}
          resizeMode={'cover'}
        />
        {renderBellEnvelopeSettingsIcons()}
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
    height: Dimensions.get('window').height * 0.25,
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
    width: 90,
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
    width: 160,
    height: 160,
    top: Dimensions.get('window').height * 0.15,
    left: Dimensions.get('window').width * 0.03,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#FFF',
  },
});
