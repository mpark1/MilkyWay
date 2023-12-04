import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Community from '../screens/AuthUser/Community/Community';

const Stack = createNativeStackNavigator();

const CommunityNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'추모공간 홈'} component={Community} />
    </Stack.Navigator>
  );
};

export default CommunityNavigation;
