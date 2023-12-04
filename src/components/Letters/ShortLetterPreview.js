import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {scaleFontSize} from '../../assets/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/core';

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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.flexDirectionRow}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={require('../../assets/images/milkyWayBackgroundImage.png')}
          />
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
                    title: '첫번째 편지',
                    relationship: '누나',
                    isPrivate: true,
                    message:
                      '사랑하는 내 동생 마루야, 다시 만날 때까지 건강하게 있어! 내 첫 고양이로 너를 만나서 넘 행복했어~ 거기선 아프지 말고 너 좋아하는 사냥 맘껏하며',
                  })
                }>
                <Ionicons name={'pencil-outline'} color={'#373737'} size={18} />
              </Pressable>
              <Pressable>
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
  card: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    height: 160,
    paddingHorizontal: 20,
    paddingTop: 17,
  },
  title: {
    color: '#000',
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
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
