import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import {signOut} from 'aws-amplify/auth';

const AccountSettings = ({navigation}) => {
  async function handleSignOut() {
    try {
      await signOut();
      navigation.navigate('SignIn');
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

export default AccountSettings;

const styles = StyleSheet.create({});
