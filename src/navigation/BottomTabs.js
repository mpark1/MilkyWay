import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MyMilkyWay from './MyMilkyWay';
import CommunityNavigation from './CommunityNavigation';
import {useDispatch} from 'react-redux';
import {resetPet} from '../redux/slices/Pet';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const dispatch = useDispatch();
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={'내 추모공간'} component={MyMilkyWay} />
      <Tab.Screen name={'커뮤니티'} component={CommunityNavigation} />
    </Tab.Navigator>
  );
}
