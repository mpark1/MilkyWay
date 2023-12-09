import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import AddNewPet from '../screens/AuthUser/AddNewPet';
import ChooseMedia from '../screens/AuthUser/CenterTabs/AlbumTab/ChooseMedia';
import WriteOrEditLetter from '../screens/AuthUser/CenterTabs/LettersTab/WriteOrEditLetter';
import MediaPreview from '../screens/AuthUser/CenterTabs/AlbumTab/MediaPreview';
import Settings from '../screens/AuthUser/Settings';
import Notifications from '../screens/AuthUser/Notifications';
import SignUp from '../screens/NonAuthUser/SignUp';
import ConfirmAccount from '../screens/NonAuthUser/ConfirmAccount';
import SetAccessLevel from '../screens/AuthUser/SetAccessLevel';
import UserSettings from '../screens/AuthUser/UserSettings';
import ChangePassword from '../screens/AuthUser/ChangePassword';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator>
      {/*<Stack.Screen*/}
      {/*  name={'SignUp'}*/}
      {/*  component={SignUp}*/}
      {/*  options={{*/}
      {/*    headerTitle: '회원가입',*/}
      {/*    headerShadowVisible: false,*/}
      {/*    headerBackTitleVisible: false,*/}
      {/*    headerTintColor: '#000',*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name={'ConfirmAccount'}*/}
      {/*  component={ConfirmAccount}*/}
      {/*  options={{*/}
      {/*    headerTitle: '이메일 인증',*/}
      {/*    headerShadowVisible: false,*/}
      {/*    headerBackTitleVisible: false,*/}
      {/*    headerTintColor: '#000',*/}
      {/*  }}*/}
      {/*/>*/}
      <Stack.Screen
        name={'BottomTabs'}
        component={BottomTabs}
        options={{headerShown: false}}
      />
      <Stack.Group
        screenOptions={{
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#000',
        }}>
        <Stack.Screen
          name={'UserSettings'}
          component={UserSettings}
          options={{
            headerTitle: '나의 계정',
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
          name={'WriteOrEditLetter'}
          component={WriteOrEditLetter}
          options={{
            headerTitle: '편지수정',
          }}
        />
        <Stack.Screen
          name={'ChooseMedia'}
          component={ChooseMedia}
          options={{
            headerTitle: '사진 / 동영상 선택',
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
