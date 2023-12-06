import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MyMilkyWay from './MyMilkyWay';
import CommunityNavigation from './CommunityNavigation';
import {getCurrentUser} from 'aws-amplify/auth';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  async function currentAuthenticatedUser() {
    try {
      const {username, userId, signInDetails} = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={'내 추모공간'} component={MyMilkyWay} />
      <Tab.Screen name={'추모공간'} component={CommunityNavigation} />
    </Tab.Navigator>
  );
}
