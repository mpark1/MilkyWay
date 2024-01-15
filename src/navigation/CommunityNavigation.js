import React from 'react';
import Community from '../screens/AuthUser/Community/Community';
import {createStackNavigator} from '@react-navigation/stack';
import PetPage from '../screens/AuthUser/PetPage';

const Stack = createStackNavigator();

const CommunityNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'추모공간 홈'} component={Community} />
      <Stack.Screen
        name={'PetPage'}
        component={PetPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default CommunityNavigation;
