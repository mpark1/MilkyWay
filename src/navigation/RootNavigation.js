import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setCognitoUsername, setCognitoUserToNull} from '../redux/slices/User';
import AuthNavigation from './AuthNavigation';
import NonAuthNavigation from './NonAuthNavigation';
import {getCurrentUser} from 'aws-amplify/auth';
import {getIdentityID} from '../utils/amplifyUtil';
import globalStyle from '../assets/styles/globalStyle';

export default function RootNavigation() {
  const dispatch = useDispatch();
  let loggedInUserId = useSelector(state => state.user.cognitoUsername); //userID

  useEffect(() => {
    const executeCheckUser = async () => {
      try {
        const {userId} = await getCurrentUser();
        console.log(
          'print userId after getCurrentUser execution inside root navigation',
          userId,
        );
        if (userId) {
          dispatch(setCognitoUsername(userId));
        }
      } catch (error) {
        console.error(
          'Error checking getCurrentUser inside root navigation:',
          error,
        );
        dispatch(setCognitoUserToNull());
      }
    };
    console.log(
      'print user id from redux inside root navigation',
      loggedInUserId,
    );
    executeCheckUser();
  }, []);

  if (loggedInUserId === undefined) {
    return (
      <View style={globalStyle.activityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {loggedInUserId ? <AuthNavigation /> : <NonAuthNavigation />}
    </NavigationContainer>
  );
}
