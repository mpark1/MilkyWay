import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import AddNewPet from '../screens/AuthUser/AddNewPet';
import ChoosePhotoOrVideo from '../screens/AuthUser/ChoosePhotoOrVideo';
import WriteOrEditLetter from '../screens/AuthUser/WriteOrEditLetter';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'BottomTabs'}
        component={BottomTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'AddNewPet'}
        component={AddNewPet}
        options={{
          headerTitle: '별이 된 아이',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#000',
        }}
      />
      <Stack.Screen
        name={'WriteOrEditLetter'}
        component={WriteOrEditLetter}
        options={{
          headerTitle: '편지수정',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#000',
        }}
      />
      <Stack.Screen
        name={'ChooseMedia'}
        component={ChoosePhotoOrVideo}
        options={{
          headerTitle: '앨범 게시물 등록',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#000',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
