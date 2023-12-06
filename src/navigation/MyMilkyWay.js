import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Pets from '../screens/AuthUser/Pets';
import Pet from '../screens/AuthUser/Pet';

// styles
import {scaleFontSize} from '../assets/styles/scaling';

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
        name={'Pets'}
        component={Pets}
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
