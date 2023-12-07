import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import {signOut} from 'aws-amplify/auth';
import {useDispatch} from 'react-redux';
import {setCognitoUserToNull, signoutUser} from '../../redux/slices/User';

const UserSettings = ({}) => {
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
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <Pressable onPress={handleSignOut}>
        <Text>로그아웃</Text>
      </Pressable>
    </View>
  );
};

export default UserSettings;

const styles = StyleSheet.create({});
