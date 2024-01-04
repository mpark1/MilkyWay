import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

// navigators
import AuthNavigation from './AuthNavigation';
import {setCognitoUsername, setCognitoUserToNull} from '../redux/slices/User';
import NonAuthNavigation from './NonAuthNavigation';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {checkUser} from '../utils/amplifyUtil';

export default function RootNavigation() {
  const dispatch = useDispatch();
  let loggedInUserId = useSelector(state => state.user.cognitoUsername); //userID
  // console.log('user cognitousername: ', loggedInUserId);

  useEffect(() => {
    let response = null;
    const executeCheckUser = async () => {
      response = await checkUser();
      // console.log(
      //   'insdie useEffect, root navigation page, after checkuser function',
      //   response,
      // );
      if (response) {
        dispatch(setCognitoUsername(response));
      } else {
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
