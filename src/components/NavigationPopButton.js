import React from 'react';
import {HeaderButton} from 'react-navigation-header-buttons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NavigationPopButton = ({navigation}) => {
  return (
    <HeaderButton
      style={{marginLeft: 8}}
      onPress={() => navigation.pop()}
      title={''}
      renderButton={() => {
        return (
          <MaterialIcons name={'arrow-back-ios'} color={'#374957'} size={26} />
        );
      }}
    />
  );
};

export default NavigationPopButton;
