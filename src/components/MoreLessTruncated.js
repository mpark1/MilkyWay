import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import MoreLessComponent from './MoreLess';
import {scaleFontSize} from '../assets/styles/scaling';
import EditOrDeleteButtons from './EditOrDeleteButtons';
import DeleteIcon from './DeleteIcon';

const MoreLessTruncated = ({item, linesToTruncate, whichTab}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [clippedText, setClippedText] = useState('');
  const {content, createdAt, relationship, title} = item;

  const handleTextLayout = event => {
    const {lines} = event.nativeEvent;
    if (lines.length > linesToTruncate) {
      setIsTruncated(true);
      const displayedText = lines
        .slice(0, linesToTruncate)
        .map(line => line.text)
        .join('');
      setClippedText(displayedText);
    }
  };

  const renderText = () => {
    return isTruncated ? (
      <MoreLessComponent
        truncatedText={clippedText}
        fullText={content}
        item={item}
        whichTab={whichTab}
      />
    ) : (
      <Text
        style={styles.content}
        numberOfLines={linesToTruncate}
        ellipsizeMode={'tail'}
        onTextLayout={handleTextLayout}>
        {content}
      </Text>
    );
  };
  return (
    <View style={styles.letter}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.flexDirectionRow}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={{
              uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzEyMTZfNTIg/MDAxNTEzMzk4OTI1NTY5.Adb0MbO3WwvlP51KiOgKWPcPyRUYh7pbP1L5Zrp45lIg.Emli51gG8JdC7p-ooJBiYvcRvaP-sNnffoHejVLqGkYg.JPEG.samusiltour/_MG_8261.JPG?type=w800',
            }}
          />
        </View>
        <View style={styles.collapsedTextContainer}>
          <View style={styles.nameRelationshipDateContainer}>
            <Text style={styles.name}>한가인{'   '}</Text>
            <Text style={styles.relationshipAndDate}>
              {relationship} ({createdAt.substring(0, 10)})
            </Text>
          </View>
          {renderText()}
          {whichTab === 'Letters' && !isTruncated && (
            <EditOrDeleteButtons item={item} />
          )}
          {whichTab === 'GuestBook' && !isTruncated && (
            <DeleteIcon item={item} />
          )}
        </View>
      </View>
    </View>
  );
};

export default MoreLessTruncated;

const styles = StyleSheet.create({
  letter: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  title: {
    color: '#374957',
    fontSize: scaleFontSize(17),
    fontWeight: 'bold',
    paddingBottom: 7,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  profilePicContainer: {
    height: 80,
    width: 80,
    marginTop: 8,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  collapsedTextContainer: {
    flex: 1,
    paddingLeft: 5,
    marginLeft: 25,
  },
  nameRelationshipDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 7,
    // backgroundColor: '#EEEEEE',
  },
  name: {
    fontWeight: 'bold',
    fontSize: scaleFontSize(16),
    color: '#374957',
  },
  relationshipAndDate: {
    color: '#939393',
    fontSize: scaleFontSize(16),
  },
  content: {
    color: '#374957',
    fontSize: scaleFontSize(16),
    lineHeight: scaleFontSize(24),
    paddingTop: 10,
  },
  editAndDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 45,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'grey',
  },
});
