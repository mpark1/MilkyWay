import React, {useState} from 'react';
import {Pressable, View, StyleSheet, Alert} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/core';
import {generateClient} from 'aws-amplify/api';
// import {deleteLetter} from '../graphql/mutations';
import AlertBox from './AlertBox';
// import {mutationItem} from '../utils/amplifyUtil';
import DeleteAlertBox from './DeleteAlertBox';

const EditOrDeleteButtons = ({item}) => {
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  const deleteLetterApi = async () => {
    const deleteLetterInput = {
      id: item.id,
      petID: item.petID,
      createdAt: item.createdAt,
    };
    // await mutationItem(
    //   isCallingAPI,
    //   setIsCallingAPI,
    //   deleteLetterInput,
    //   deleteLetter,
    //   '편지가 성공적으로 삭제되었습니다.',
    //   'none',
    // );
  };

  const navigation = useNavigation();
  return (
    <View style={styles.editAndDeleteContainer}>
      <Pressable
        onPress={() =>
          navigation.navigate('EditLetter', {
            letterID: item.id,
            title: item.title,
            relationship: item.relationship,
            isPrivate: item.accessLevel === 'PRIVATE',
            message: item.content,
            timestamp: item.createdAt,
          })
        }>
        <EvilIcons name={'pencil'} color={'#373737'} size={26} />
      </Pressable>
      <Pressable onPress={() => DeleteAlertBox(deleteLetterApi)}>
        <EvilIcons name={'trash'} color={'#373737'} size={26} />
      </Pressable>
    </View>
  );
};

export default EditOrDeleteButtons;

const styles = StyleSheet.create({
  editAndDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
});
