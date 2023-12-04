import React from 'react';
import {StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler'; // for bottom sheet
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import RootNavigation from './src/navigation/RootNavigation';
import globalStyle from './src/assets/styles/globalStyle';

const App = () => {
  return (
    <GestureHandlerRootView style={globalStyle.flex}>
      <BottomSheetModalProvider>
        <RootNavigation />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({});

export default App;
