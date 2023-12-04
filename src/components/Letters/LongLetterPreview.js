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

const LongLetterPreview = ({
  letterID,
  title,
  relationship,
  timestamp,
  content,
  profilePic,
  name,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={isExpanded ? styles.letter : styles.letter}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.flexDirectionRow}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={require('../../assets/images/milkyWayBackgroundImage.png')}
          />
        </View>
        <View
          style={
            isExpanded
              ? styles.expandedTextContainer
              : styles.collapsedTextContainer
          }>
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
            {isExpanded ? (
              <>
                <Text style={styles.content}>{content}</Text>
                <Pressable style={styles.moreButton} onPress={toggleExpanded}>
                  <Text style={styles.moreButtonTitle}>닫기</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.content}>
                  {content.substring(0, 58)}...
                </Text>
                <Pressable style={styles.moreButton} onPress={toggleExpanded}>
                  <Text style={styles.moreButtonTitle}>더보기</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default LongLetterPreview;

const styles = StyleSheet.create({
  letter: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 10,
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
    marginTop: 10,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  collapsedTextContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  expandedTextContainer: {
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
