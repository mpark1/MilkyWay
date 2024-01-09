import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

// navigators
import AuthNavigation from './AuthNavigation';
import {setCognitoUsername, setCognitoUserToNull} from '../redux/slices/User';
import NonAuthNavigation from './NonAuthNavigation';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {checkUser} from '../utils/amplifyUtil';
import {getCurrentUser} from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from 'react-native-fs';

export default function RootNavigation() {
  const dispatch = useDispatch();
  let loggedInUserId = useSelector(state => state.user.cognitoUsername); //userID
  // console.log('user cognitousername: ', loggedInUserId);

  useEffect(() => {
    const executeCheckUser = async () => {
      try {
        const {userId} = await getCurrentUser();
        if (userId) {
          dispatch(setCognitoUsername(userId));
        }
      } catch (error) {
        console.error('Error checking getCurrentUser:', error);
        dispatch(setCognitoUserToNull());
      }
    };
    executeCheckUser();
  }, [dispatch]);

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
