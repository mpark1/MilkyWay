import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler'; // for bottom sheet
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import RootNavigation from './src/navigation/RootNavigation';
import globalStyle from './src/assets/styles/globalStyle';
import store from './src/redux/store';
import {Provider} from 'react-redux';

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

export default App;
