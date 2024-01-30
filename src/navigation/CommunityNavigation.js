import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Community from '../screens/AuthUser/Community/Community';
import SearchPets from '../screens/AuthUser/Community/SearchPets';
import {scaleFontSize} from '../assets/styles/scaling';
import NavigationPopButton from '../components/NavigationPopButton';

const Stack = createStackNavigator();

const CommunityNavigation = ({navigation}) => {
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
        name={'추모공간 홈'}
        component={Community}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'SearchPet'}
        component={SearchPets}
        options={{
          headerShown: true,
          headerTitle: '은하수 여행',
          headerBackTitleVisible: false,
          headerLeft: () => <NavigationPopButton navigation={navigation} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default CommunityNavigation;
