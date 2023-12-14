import React from 'react';

import BottomTabs from './BottomTabs';
import AddNewPet from '../screens/AuthUser/AddNewPet';
import SetAccessLevel from '../screens/AuthUser/SetAccessLevel';
import ChooseMedia from '../screens/AuthUser/ChooseMedia';
import WriteLetter from '../screens/AuthUser/WriteLetter';
import MediaPreview from '../screens/AuthUser/MediaPreview';
import Settings from '../screens/AuthUser/Settings';
import Notifications from '../screens/AuthUser/Notifications';

import {scaleFontSize} from '../assets/styles/scaling';
import EditLetter from '../screens/AuthUser/EditLetter';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const AuthNavigation = () => {
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
        name={'BottomTabs'}
        component={BottomTabs}
        options={{headerShown: false}}
      />
      <Stack.Group>
        <Stack.Screen
          name={'AddNewPet'}
          component={AddNewPet}
          options={{
            headerTitle: '별이 된 아이',
          }}
        />
        <Stack.Screen
          name={'SetAccessLevel'}
          component={SetAccessLevel}
          options={{
            headerTitle: '추모공간 접근 설정',
          }}
        />
        <Stack.Screen
          name={'Settings'}
          component={Settings}
          options={{
            headerTitle: '설정',
          }}
        />
        <Stack.Screen
          name={'Notifications'}
          component={Notifications}
          options={{
            headerTitle: '알림',
          }}
        />
        <Stack.Screen
          name={'WriteLetter'}
          component={WriteLetter}
          options={{
            headerTitle: '편지쓰기',
          }}
        />
        <Stack.Screen
          name={'EditLetter'}
          component={EditLetter}
          options={{
            headerTitle: '편지수정',
          }}
        />
        <Stack.Screen
          name={'ChooseMedia'}
          component={ChooseMedia}
          options={{
            headerTitle: '사진/동영상 선택',
          }}
        />
        <Stack.Screen
          name={'MediaPreview'}
          component={MediaPreview}
          options={{
            headerTitle: '캡션 작성',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthNavigation;
