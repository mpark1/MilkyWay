import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Community from '../screens/AuthUser/Community/Community';
import PetPage from '../screens/AuthUser/PetPage';
import SearchPets from '../screens/AuthUser/Community/SearchPets';
import NavigationPopButton from '../components/NavigationPopButton';
import TestResult from '../screens/AuthUser/PBQTest/TestResult';
import globalStyle from '../assets/styles/globalStyle';
import ServiceQuestions from '../screens/AuthUser/PBQTest/ServiceQuestions';

const Stack = createStackNavigator();

const CommunityNavigation = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={globalStyle.stackNavigator}
      initialRouteName="추모공간 홈">
      <Stack.Screen
        name={'추모공간 홈'}
        component={Community}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'PetPage'}
        component={PetPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'TestResult'}
        component={TestResult}
        options={{
          headerShown: true,
          headerTitle: '심리 테스트 결과',
          headerLeft: () => null,
          headerStyle: {
            backgroundColor: '#EEEEEE', // Set your desired color
          },
        }}
      />
      <Stack.Screen
        name={'ServiceQuestions'}
        component={ServiceQuestions}
        options={{
          headerShown: true,
          headerTitle: '추가질문',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name={'SearchPets'}
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
