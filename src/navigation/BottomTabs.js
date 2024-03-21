import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MyMilkyWay from './MyMilkyWay';
import CommunityNavigation from './CommunityNavigation';
import {useDispatch} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {scaleFontSize} from '../assets/styles/scaling';

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  '내 추모공간': 'star',
  커뮤니티: 'paw',
};

const setTabBarIcon = (route, color) => {
  const iconName = TAB_ICON[route.name];
  return iconName === 'star' ? (
    <Fontisto name={iconName} size={20} color={color} />
  ) : (
    <FontAwesome6 name={iconName} size={20} color={color} />
  );
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {backgroundColor: '#FFFFFF'},
        tabBarInactiveTintColor: '#374957',
        tabBarIcon: ({color}) => setTabBarIcon(route, color),
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {fontSize: scaleFontSize(14)},
      })}>
      <Tab.Screen name={'내 추모공간'} component={MyMilkyWay} />
      <Tab.Screen name={'커뮤니티'} component={CommunityNavigation} />
    </Tab.Navigator>
  );
}
