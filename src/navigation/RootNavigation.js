import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

// navigators
import AuthNavigation from './AuthNavigation';
import {setCognitoUsername, setCognitoUserToNull} from '../redux/slices/User';
import NonAuthNavigation from './NonAuthNavigation';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {getCurrentUser} from 'aws-amplify/auth';
import {getIdentityID} from '../utils/amplifyUtil';

export default function RootNavigation() {
  const dispatch = useDispatch();
  let loggedInUserId = useSelector(state => state.user.cognitoUsername); //userID
  // console.log('user cognitousername: ', loggedInUserId);

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
  }, [loggedInUserId]);

  if (loggedInUserId === undefined) {
    return (
      <View style={styles.activityIndicatorContainer}>
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

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
