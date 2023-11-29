/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Pressable,
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.backgroundWhite}>
      <Pressable style={styles.kakaoLogin}>
        <Image source={require('./src/assets/images/kakao_login_small.png')} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundWhite: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoLogin: {
    marginTop: 20,
  },
});

export default App;
