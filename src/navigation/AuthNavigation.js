import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import BottomTabs from './BottomTabs';
import AddNewPet from '../screens/AuthUser/AddNewPet';
import SetAccessLevel from '../screens/AuthUser/SetAccessLevel';
import ChooseMedia from '../screens/AuthUser/ChooseMedia';
import WriteLetter from '../screens/AuthUser/WriteLetter';
import MediaPreview from '../screens/AuthUser/MediaPreview';
import Settings from '../screens/AuthUser/Settings';
import EditLetter from '../screens/AuthUser/EditLetter';
import globalStyle from '../assets/styles/globalStyle';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.cognitoUsername);

  useEffect(() => {
    // const user = await fetchUserFromDB(userId);
    // dispatch(
    //   setOwnerDetails({
    //     name: user.name,
    //     email: user.email,
    //   }),
    // );
    // user.profilePic.length > 0 &&
    //   dispatch(setUserProfilePicS3Key(user.profilePic)); // s3 key
    // await retrieveS3Url(user.profilePic).then(res => {
    //   // console.log('print user profile pic url', res.url.href);
    //   dispatch(
    //     setUserProfilePic({
    //       profilePic: res.url.href,
    //       s3UrlExpiredAt: res.expiresAt.toString(),
    //     }),
    //   );
    // });
    // await checkAdmin().then(res => dispatch(setIsAdmin(res)));
  }, []);

  return (
    <Stack.Navigator screenOptions={globalStyle.stackNavigator}>
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
