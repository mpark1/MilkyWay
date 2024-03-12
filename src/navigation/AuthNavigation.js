import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import AddNewPet from '../screens/AuthUser/AddNewPet';
import AddNewPet2 from '../screens/AuthUser/AddNewPet2';
import SetAccessLevel from '../screens/AuthUser/SetAccessLevel';
import ChooseMedia from '../screens/AuthUser/ChooseMedia';
import WriteLetter from '../screens/AuthUser/WriteLetter';
import MediaPreview from '../screens/AuthUser/MediaPreview';
import Settings from '../screens/AuthUser/Settings';
import EditLetter from '../screens/AuthUser/EditLetter';
import TesteeInfo from '../screens/AuthUser/PBQTest/TesteeInfo';
import PBQ from '../screens/AuthUser/PBQTest/PBQ';
import TestResult from '../screens/AuthUser/PBQTest/TestResult';
import ServiceQuestions from '../screens/AuthUser/PBQTest/ServiceQuestions';

import globalStyle from '../assets/styles/globalStyle';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={globalStyle.stackNavigator}>
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
        }}
      />
      <Stack.Screen
        name={'AddNewPet2'}
        component={AddNewPet2}
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
      <Stack.Screen
        name={'TesteeInfo'}
        component={TesteeInfo}
        options={{
          headerTitle: '심리 테스트 준비',
        }}
      />
      <Stack.Screen
        name={'PBQ'}
        component={PBQ}
        options={{
          headerTitle: '심리 테스트',
        }}
      />
      <Stack.Screen
        name={'TestResult'}
        component={TestResult}
        options={{
          headerTitle: '심리 테스트 결과',
        }}
      />
      <Stack.Screen
        name={'ServiceQuestions'}
        component={ServiceQuestions}
        options={{
          headerTitle: '추가 질문',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
