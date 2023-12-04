import React, {useEffect} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Onboarding from '../screens/NonAuthUser/Onboarding';
import SignIn from '../screens/NonAuthUser/SignIn';

const Stack = createNativeStackNavigator();

export const NonAuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Onboarding'} component={Onboarding} />
      <Stack.Screen name={'SignIn'} component={SignIn} />
    </Stack.Navigator>
  );
};

export default NonAuthNavigation;
