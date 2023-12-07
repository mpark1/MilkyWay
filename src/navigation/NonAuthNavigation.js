import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../screens/NonAuthUser/SignIn';
import SignUp from '../screens/NonAuthUser/SignUp';
import {scaleFontSize} from '../assets/styles/scaling';
import ConfirmAccount from '../screens/NonAuthUser/ConfirmAccount';
import ForgotPassword from '../screens/NonAuthUser/ForgotPassword';

const Stack = createNativeStackNavigator();

export const NonAuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: scaleFontSize(22)},
        headerTintColor: '#374957',
      }}>
      <Stack.Screen
        name={'SignIn'}
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'SignUp'}
        component={SignUp}
        options={{
          headerTitle: '회원가입',
        }}
      />
      <Stack.Screen
        name={'ConfirmAccount'}
        component={ConfirmAccount}
        options={{
          headerTitle: '이메일 인증',
        }}
      />
      <Stack.Screen
        name={'ForgotPassword'}
        component={ForgotPassword}
        options={{
          headerTitle: '비밀번호찾기',
        }}
      />
    </Stack.Navigator>
  );
};

export default NonAuthNavigation;
