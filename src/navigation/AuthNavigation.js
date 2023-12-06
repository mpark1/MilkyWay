import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import AddNewPet from '../screens/AuthUser/AddNewPet';
import ChooseMedia from '../screens/AuthUser/ChooseMedia';
import WriteOrEditLetter from '../screens/AuthUser/WriteOrEditLetter';
import MediaPreview from '../screens/AuthUser/MediaPreview';
import Settings from '../screens/AuthUser/Settings';
import Notifications from '../screens/AuthUser/Notifications';
import SignUp from '../screens/NonAuthUser/SignUp';
import ConfirmAccount from '../screens/NonAuthUser/ConfirmAccount';
import SignIn from '../screens/NonAuthUser/SignIn';
import {scaleFontSize} from '../assets/styles/scaling';
import ForgotPassword from '../screens/NonAuthUser/ForgotPassword';

const Stack = createNativeStackNavigator();

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
        name={'SignIn'}
        component={SignIn}
        options={{
          headerShown: false,
        }}
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
        name={'BottomTabs'}
        component={BottomTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ForgotPassword'}
        component={ForgotPassword}
        options={{
          headerTitle: '비밀번호찾기',
        }}
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
