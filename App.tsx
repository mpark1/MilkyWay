import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler'; // for bottom sheet
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Provider} from 'react-redux';
import RootNavigation from './src/navigation/RootNavigation';
import globalStyle from './src/assets/styles/globalStyle';
import store from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={globalStyle.flex}>
        <BottomSheetModalProvider>
          <RootNavigation />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
