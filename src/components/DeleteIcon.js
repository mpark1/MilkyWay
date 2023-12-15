import React, {useState} from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {deleteGuestBook} from '../graphql/mutations';
import {mutationItem} from '../utils/amplifyUtil';
import DeleteAlertBox from './DeleteAlertBox';

const DeleteIcon = ({item}) => {
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  const deleteGuestBookApi = async () => {
    const deleteGuestBookInput = {
      id: item.id,
      petID: item.petID,
      createdAt: item.createdAt,
    };
    await mutationItem(
      isCallingAPI,
      setIsCallingAPI,
      deleteGuestBookInput,
      deleteGuestBook,
      '방명록이 삭제되었습니다.',
      'none',
    );
  };

  return (
    <View style={styles.editAndDeleteContainer}>
      <Pressable onPress={() => DeleteAlertBox(deleteGuestBookApi)}>
        <EvilIcons name={'trash'} color={'#373737'} size={26} />
      </Pressable>
    </View>
  );
};

export default DeleteIcon;

const styles = StyleSheet.create({
  editAndDeleteContainer: {
    width: 30,
  },
});
