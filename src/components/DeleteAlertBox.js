import {Alert} from 'react-native';

const DeleteAlertBox = onPressFunc => {
  Alert.alert('정말 삭제하시겠습니까?', '삭제 후 복구가 불가능합니다.', [
    {text: '취소'},
    {
      text: '삭제',
      onPress: () => {
        onPressFunc;
      },
    },
  ]);
};

export default DeleteAlertBox;
