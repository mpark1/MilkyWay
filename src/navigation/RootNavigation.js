import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

// navigators
import AuthNavigation from './AuthNavigation';
const RootNavigation = () => {
  return (
    <NavigationContainer>
      <AuthNavigation />
    </NavigationContainer>
  );
};

export default RootNavigation;
