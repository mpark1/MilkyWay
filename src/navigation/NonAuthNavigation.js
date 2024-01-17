import React, {useEffect} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Onboarding from '../screens/NonAuthUser/Onboarding';
import SignIn from '../screens/NonAuthUser/SignIn';
import SignUp from '../screens/NonAuthUser/SignUp';

const Stack = createNativeStackNavigator();

export const NonAuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Onboarding'} component={Onboarding} />
      <Stack.Screen name={'SignIn'} component={SignIn} />
      <Stack.Screen name={'SignUp'} component={SignUp} />
    </Stack.Navigator>
  );
};

export default NonAuthNavigation;
