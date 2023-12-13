import React from 'react';
import {Pressable, View, StyleSheet, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/core';

const EditOrDeleteButtons = () => {
  const onDeleteLetter = () => {
    Alert.alert(
      '편지를 삭제하시겠습니까?',
      '삭제된 편지는 복구가 불가능합니다.',
      [
        {text: '취소'},
        {
          text: '삭제',
          // onPress: updateLetterStateToDeleted, // async function
        },
      ],
    );
  };

  const navigation = useNavigation();
  return (
    <View style={styles.editAndDeleteContainer}>
      <Pressable
        onPress={() =>
          navigation.navigate('WriteOrEditLetter', {
            actionType: 'edit',
            // title: title,
            // relationship: relationship,
            // isPrivate: true,
            // message: content,
          })
        }>
        <Ionicons name={'pencil-outline'} color={'#373737'} size={18} />
      </Pressable>
      <Pressable onPress={() => onDeleteLetter()}>
        <EvilIcons name={'trash'} color={'#373737'} size={24} />
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
