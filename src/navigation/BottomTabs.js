import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MyMilkyWay from './MyMilkyWay';
import CommunityNavigation from './CommunityNavigation';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={'내 추모공간'} component={MyMilkyWay} />
      <Tab.Screen name={'추모공간'} component={CommunityNavigation} />
    </Tab.Navigator>
  );
}
