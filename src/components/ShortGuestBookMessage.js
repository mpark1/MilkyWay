import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import {getTimeElapsed} from '../utils/utils';

const ShortGuestBookMessage = ({
  authorID,
  name,
  profilePic,
  message,
  timestamp,
}) => {
  /* TODO
   *   1: Given authorID, fetch author's profilePic and name(or nickname) from User table
   *   2:
   * */

  return (
    <View style={styles.container}>
      <View style={styles.flexDirectionRow}>
        <View style={styles.profilePicContainer}>
          <Image style={styles.profilePic} source={{uri: profilePic}} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.nameRelationshipDateContainer} />

          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.date}>{getTimeElapsed(timestamp)}</Text>
            <Text style={styles.message}>{message.substring(0, 60)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShortGuestBookMessage;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderColor: '#D9D9D9',
    paddingHorizontal: Dimensions.get('window').width * 0.05,
    paddingVertical: 12,
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
    fontSize: scaleFontSize(16),
    color: '#000',
  },
  date: {
    color: '#000',
    fontSize: scaleFontSize(12),
    paddingTop: 5,
    paddingBottom: 10,
  },
  message: {
    color: '#000',
    fontSize: scaleFontSize(15),
    lineHeight: scaleFontSize(20),
  },
});
