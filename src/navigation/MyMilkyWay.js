import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Pets from '../screens/AuthUser/Pets';
import PetPage from '../screens/AuthUser/PetPage';

// styles
import {scaleFontSize} from '../assets/styles/scaling';
import UserSettings from '../screens/AuthUser/UserSettings';
import ChangePassword from '../screens/AuthUser/ChangePassword';
import SignOutButton from '../components/SignOutButton';

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
        initialParams={{fetchAgain: false}}
      />
      <Stack.Screen
        name={'UserSettings'}
        component={UserSettings}
        options={{
          headerTitle: '나의 계정',
          headerRight: () => <SignOutButton />,
        }}
      />
      <Stack.Screen
        name={'ChangePassword'}
        component={ChangePassword}
        options={{
          headerTitle: '비밀번호 변경',
        }}
      />
      <Stack.Screen
        name={'PetPage'}
        component={PetPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MyMilkyWay;
