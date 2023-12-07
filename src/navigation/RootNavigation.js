import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentUser, fetchAuthSession} from 'aws-amplify/auth';

// navigators
import AuthNavigation from './AuthNavigation';
import {setUser} from '../redux/slices/User';
import NonAuthNavigation from './NonAuthNavigation';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const RootNavigation = () => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector(state => state.user.cognitoUsername); //userID

  useEffect(() => {
    async function checkUser() {
      const {userId} = await getCurrentUser();

      if (!userId) {
        dispatch(setUser(null));
      } else {
        console.log('userId from getCurrentUser', userId);
        dispatch(setUser(userId));
      }
    }

    async function currentSession() {
      try {
        const {accessToken, idToken} = (await fetchAuthSession()).tokens ?? {};
        console.log('accessToken: ', accessToken);
        console.log('idToken: ', idToken);
      } catch (err) {
        console.log(err);
      }
    }

    checkUser();
    currentSession();
  }, []);

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
};

export default RootNavigation;

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
