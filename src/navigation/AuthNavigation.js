import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import AddNewPet from '../screens/AuthUser/AddNewPet';
import ChooseMedia from '../screens/AuthUser/ChooseMedia';
import WriteOrEditLetter from '../screens/AuthUser/WriteOrEditLetter';
import MediaPreview from '../screens/AuthUser/MediaPreview';

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
        component={ChooseMedia}
        options={{
          headerTitle: '사진 / 동영상 선택',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#000',
        }}
      />
      <Stack.Screen
        name={'MediaPreview'}
        component={MediaPreview}
        options={{
          headerTitle: '캡션 작성',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#000',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
