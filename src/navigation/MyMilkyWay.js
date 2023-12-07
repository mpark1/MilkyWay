import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Pets from '../screens/AuthUser/Pets';
import Pet from '../screens/AuthUser/Pet';

// styles
import {scaleFontSize} from '../assets/styles/scaling';
import UserSettings from '../screens/AuthUser/UserSettings';

const Stack = createNativeStackNavigator();

const MyMilkyWay = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitleVisible: 'false',
        headerTintColor: '#000',
        headerTitleStyle: {
          fontSize: scaleFontSize(20),
          color: '#000',
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        options={{headerShown: false}}
        name={'MyStars'}
        component={Pets}
      />
      <Stack.Screen
        name={'UserSettings'}
        component={UserSettings}
        options={{
          headerTitle: '나의 계정 설정',
        }}
      />
      <Stack.Screen
        name={'Pet'}
        component={Pet}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MyMilkyWay;
