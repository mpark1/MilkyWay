import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Pressable,
  ActivityIndicator,
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
import {getPet, getPetFamily} from '../../graphql/queries';
import {useDispatch, useSelector} from 'react-redux';
import {querySingleItem} from '../../utils/amplifyUtil';

const centerTab = createMaterialTopTabNavigator();

const PetPage = ({navigation}) => {
  const [petInfo, setPetInfo] = useState({});
  const userID = useSelector(state => state.user.cognitoUsername);
  const petID = useSelector(state => state.user.currentPetID);

  const [isManager, setIsManager] = useState(false);
  const [isFamily, setIsFamily] = useState(false);

  useEffect(() => {
    querySingleItem(getPet, {id: petID}).then(response =>
      setPetInfo(response.getPet),
    );

    /* 가족관계 확인 */
    try {
      getPetFamily({
        familyMemberID: userID,
        petID: petID,
      });
      setIsFamily(true);

      // 매니저인지 확인
      if (petInfo.owner === userID) {
        setIsManager(true);
      }
    } catch (error) {
      console.log('Error fetching pet family', error);
      // 가족이 아닐 경우 DB 기록이 없는데 null 또는 에러 반환되는지 확인 해야함
      setIsFamily(false);
    }
  }, [petID]);

  const renderBellEnvelopeSettingsIcons = () => {
    // 매니저일 경우에만 보여주기
    return (
      isManager && (
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
          {petInfo.owner === userID && (
            <Pressable
              onPress={() =>
                navigation.navigate('Settings', {petInfo: petInfo})
              }>
              <Ionicons name={'settings-outline'} color={'#FFF'} size={24} />
            </Pressable>
          )}
        </View>
      )
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
        <PetProfile
          name={petInfo.name}
          birthday={petInfo.birthday}
          deathDay={petInfo.deathDay}
        />
      </View>

      <View style={styles.profilePicContainer}>
        <Image
          style={styles.profilePic}
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSceREFrbL87nsKQxJerouKhgKFcYVCaqEFw&usqp=CAU',
          }}
          resizeMode={'cover'}
        />
      </View>
      {petInfo.id ? (
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
          <centerTab.Screen
            name={'홈'}
            component={Home}
            initialParams={{
              petID: petInfo.id,
              lastWord: petInfo.lastWord,
              isManager: isManager,
            }}
          />
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
              isPublic: petInfo.accessLevel === 'Public',
              isManager: isManager,
            }}
          />
        </centerTab.Navigator>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
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
    width: 130,
    height: 130,
    top: Dimensions.get('window').height * 0.1,
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
