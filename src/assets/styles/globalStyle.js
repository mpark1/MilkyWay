import {StyleSheet} from 'react-native';
import {scaleFontSize} from './scaling';

const globalStyle = StyleSheet.create({
  backgroundWhite: {
    backgroundColor: '#FFFFFF',
  },
  backgroundBlue: {
    backgroundColor: '#6395E1',
  },
  flex: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  stackNavigator: {
    headerShadowVisible: false,
    headerBackTitleVisible: false,
    headerTitleAlign: 'center',
    headerTitleStyle: {fontSize: scaleFontSize(22)},
    headerTintColor: '#374957',
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default globalStyle;
