import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Text, View, Platform} from 'react-native';
import MoreLessComponent from './MoreLess';
import {scaleFontSize} from '../assets/styles/scaling';
import EditOrDeleteButtons from './EditOrDeleteButtons';
import DeleteIcon from './DeleteIcon';

const MoreLessTruncated = ({item, linesToTruncate, whichTab}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [clippedText, setClippedText] = useState('');
  const {createdAt, relationship, title} = item;
  const text = item.content.trim();

  const handleTextLayout = event => {
    const {lines} = event.nativeEvent;
    if (lines.length > linesToTruncate) {
      setIsTruncated(true);
      let displayedText = lines
        .slice(0, linesToTruncate)
        .map(line => line.text)
        .join('');
      setClippedText(displayedText.substring(0, displayedText.length - 4));
    }
  };

  const renderText = () => {
    return isTruncated ? (
      <MoreLessComponent
        truncatedText={clippedText}
        fullText={text}
        item={item}
        whichTab={whichTab}
      />
    ) : (
      <Text
        style={styles.content}
        numberOfLines={linesToTruncate}
        onTextLayout={handleTextLayout}>
        {text}
      </Text>
    );
  };
  //
  // const printCallback = useCallback(() => {
  //   console.log('print fulltext', text);
  //   console.log('print isTruncated? ', isTruncated);
  //   console.log('print clippedText', clippedText);
  // }, [clippedText, isTruncated]);

  return (
    <View style={styles.letter}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.flexDirectionRow}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={{
              uri: item.profilePic,
            }}
          />
        </View>
        <View style={styles.collapsedTextContainer}>
          {Platform.OS === 'ios' && (
            <Text
              style={{height: 0}}
              onTextLayout={event => {
                const {lines} = event.nativeEvent;
                if (lines.length > linesToTruncate) {
                  setIsTruncated(true);
                  let text = lines
                    .splice(0, linesToTruncate)
                    .map(line => line.text)
                    .join('');
                  setClippedText(text.substring(0, text.length - 4));
                }
              }}>
              {text}
            </Text>
          )}
          <View style={styles.nameRelationshipDateContainer}>
            <Text style={styles.name}>
              {item.userName}
              {'   '}
            </Text>
            <Text style={styles.relationshipAndDate}>
              {relationship} ({createdAt.substring(0, 10)})
            </Text>
          </View>
          {renderText()}
          <View style={styles.editAndDeleteContainer}>
            {whichTab === 'Letters' && !isTruncated && (
              <EditOrDeleteButtons item={item} />
            )}
            {whichTab === 'GuestBook' && !isTruncated && (
              <DeleteIcon item={item} />
            )}
          </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
});
