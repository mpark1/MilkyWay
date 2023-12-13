import React, {useState} from 'react';
import {Pressable, View, StyleSheet, Alert} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/core';
import {generateClient} from 'aws-amplify/api';
import {deleteLetter} from '../graphql/mutations';
import AlertBox from './AlertBox';

const EditOrDeleteButtons = ({item}) => {
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const deleteLetterApi = async () => {
    const deleteLetterInput = {
      id: item.id,
      petID: item.petID,
      createdAt: item.createdAt,
    };
    try {
      if (!isCallingAPI) {
        setIsCallingAPI(true);
        const client = generateClient();
        const response = await client.graphql({
          query: deleteLetter,
          variables: {input: deleteLetterInput},
          authMode: 'userPool',
        });
        AlertBox('편지가 성공적으로 삭제되었습니다.', '', '확인', 'none');
        console.log('response for deleting a letter in db: ', response);
      }
    } catch (error) {
      console.log('error for updating letter to db: ', error);
    } finally {
      setIsCallingAPI(false);
    }
  };
  const onDeleteLetter = () => {
    Alert.alert(
      '편지를 삭제하시겠습니까?',
      '삭제된 편지는 복구가 불가능합니다.',
      [
        {text: '취소'},
        {
          text: '삭제',
          onPress: () => deleteLetterApi(),
        },
      ],
    );
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
      <Pressable onPress={() => onDeleteLetter()}>
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
