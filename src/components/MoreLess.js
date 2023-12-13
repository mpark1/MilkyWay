import React, {useState} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import EditOrDeleteButtons from './EditOrDeleteButtons';

const MoreLessComponent = ({truncatedText, fullText}) => {
  const [more, setMore] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.content}>
        {!more ? `${truncatedText}...` : fullText}
      </Text>

      {more && (
        <View style={styles.editAndDeleteContainer}>
          <EditOrDeleteButtons />
        </View>
      )}
      <Pressable
        style={styles.seeLess.container}
        onPress={() => setMore(!more)}>
        <Text style={styles.seeLess.title}>{more ? '닫기' : '더보기'}</Text>
      </Pressable>
    </View>
  );
};

export default MoreLessComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 10,
  },
  content: {
    color: '#374957',
    fontSize: scaleFontSize(16),
    lineHeight: scaleFontSize(24),
  },
  editAndDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 35,
    bottom: 3,
  },
  seeLess: {
    container: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    title: {
      color: '#939393',
      fontSize: scaleFontSize(14),
      lineHeight: scaleFontSize(24),
    },
  },
});
