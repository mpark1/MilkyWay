import React from 'react';
import {StyleSheet, View, Text, Image, Pressable, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {scaleFontSize} from '../../assets/styles/scaling';

const ShortLetterPreview = ({
  letterID,
  title,
  relationship,
  timestamp,
  content,
  profilePic,
  name,
}) => {
  const navigation = useNavigation();

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

  return (
    <View style={styles.letter}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.flexDirectionRow}>
        <View style={styles.profilePicContainer}>
          <Image style={styles.profilePic} source={{uri: profilePic}} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.nameRelationshipDateContainer}>
            <Text style={styles.name}>
              {name}
              {'   '}
            </Text>
            <Text style={styles.relationshipAndDate}>
              {relationship} ({timestamp})
            </Text>
          </View>

          <View>
            <Text style={styles.content}>{content.substring(0, 60)}</Text>
            <View style={styles.editAndDeleteContainer}>
              <Pressable
                onPress={() =>
                  navigation.navigate('WriteOrEditLetter', {
                    actionType: 'edit',
                    title: title,
                    relationship: relationship,
                    isPrivate: true,
                    message: content,
                  })
                }>
                <Ionicons name={'pencil-outline'} color={'#373737'} size={18} />
              </Pressable>
              <Pressable onPress={() => onDeleteLetter()}>
                <EvilIcons name={'trash'} color={'#373737'} size={24} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShortLetterPreview;

const styles = StyleSheet.create({
  letter: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  title: {
    color: '#000',
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    paddingBottom: 7,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  profilePicContainer: {
    height: 80,
    width: 80,
    alignSelf: 'center',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  nameRelationshipDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 7,
  },
  name: {
    fontWeight: 'bold',
    fontSize: scaleFontSize(16),
    color: '#020202',
  },
  relationshipAndDate: {
    color: '#939393',
    fontSize: scaleFontSize(16),
  },
  content: {
    color: '#000',
    fontSize: scaleFontSize(16),
    lineHeight: scaleFontSize(24),
  },
  moreButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  moreButtonTitle: {
    color: '#939393',
    fontSize: scaleFontSize(16),
    lineHeight: scaleFontSize(24),
  },
  editAndDeleteContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 45,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
