import {Alert} from 'react-native';

const AlertBox = (title, message, buttonText, onPressInput) => {
  const onPressFunction = () => {
    if (onPressInput === 'none') {
      return () => {};
    } else {
      return onPressInput;
    }
  };

  return Alert.alert(title, message, [
    {
      text: buttonText,
      onPress: onPressFunction(),
    },
  ]);
};

export default AlertBox;
