import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

// navigators
import AuthNavigation from './AuthNavigation';
import NonAuthNavigation from './NonAuthNavigation';
const RootNavigation = () => {
  return (
    <NavigationContainer>
      <AuthNavigation />
      {/*<NonAuthNavigation />*/}
    </NavigationContainer>
  );
};

export default RootNavigation;
