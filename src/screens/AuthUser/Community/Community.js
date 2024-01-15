import React, {useCallback} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';

const Community = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      console.log('community navigation is focused');
      return () => console.log('community unfocused');
    }, [navigation]), // Dependency array with navigation to make sure the effect runs when navigation changes
  );

  return (
    <View>
      <Text>추모공간 탭의 첫 화면</Text>
    </View>
  );
};

export default Community;
