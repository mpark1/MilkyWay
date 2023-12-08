import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {signOut} from 'aws-amplify/auth';
import {useDispatch} from 'react-redux';
import {setCognitoUserToNull} from '../redux/slices/User';

import {scaleFontSize} from '../assets/styles/scaling';

const SignOutButton = () => {
  const dispatch = useDispatch();
  async function handleSignOut() {
    try {
      await signOut();
      dispatch(setCognitoUserToNull());
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <Pressable onPress={handleSignOut}>
      <Text style={styles.text}>로그아웃</Text>
    </Pressable>
  );
};

export default SignOutButton;

const styles = StyleSheet.create({
  text: {
    fontSize: scaleFontSize(18),
    color: '#FA3B3B',
  },
});
