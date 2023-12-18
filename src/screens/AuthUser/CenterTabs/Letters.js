import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import mockData from '../../../data/letters.json';
import {pagination} from '../../../utils/pagination';
import ReadMoreText from '@amuizz/read-more-text';
import {scaleFontSize} from '../../../assets/styles/scaling';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import EditOrDeleteButtons from '../../../components/EditOrDeleteButtons';

const Letters = ({navigation}) => {
  const pageSize = 2;
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedLetters, setRenderedLetters] = useState(mockData.slice(0, 2));
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);

  const [line, setLine] = useState(2);
  const [isActivated, setIsActivated] = useState(false);
  const handleLine = () => {
    isActivated ? setLine(2) : setLine(Number.MAX_SAFE_INTEGER);
    setIsActivated(prev => !prev);
  };
  const renderFlatListItem = useCallback(({item}) => {
    return (
      <MoreLessTruncated item={item} linesToTruncate={2} whichTab={'Letters'} />
    );
  }, []);

  const renderWriteLetterButton = useCallback(() => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <DashedBorderButton
          type={'thin'}
          title={'편지쓰기'}
          titleColor={'gray'}
          circleSize={30}
          onPress={() =>
            navigation.navigate('WriteOrEditLetter', {
              actionType: 'write',
              title: '',
              relationship: '',
              isPrivate: false,
              message: '',
            })
          }
        />
      </View>
    );
  }, []);

  const onEndReached = useCallback(() => {
    if (!isLoadingLetters) {
      setIsLoadingLetters(true);
      setRenderedLetters(prev => [
        ...prev,
        ...pagination(mockData, pageNumber + 1, pageSize, setPageNumber),
      ]);
      setIsLoadingLetters(false);
    }
  }, [isLoadingLetters, pageNumber]);

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => setIsLoadingLetters(false)}
        onEndReachedThreshold={0.7}
        onEndReached={onEndReached}
        data={renderedLetters}
        renderItem={renderFlatListItem}
        ListHeaderComponent={renderWriteLetterButton}
      />
    </View>
  );
};

export default Letters;

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: '#FFF',
    paddingTop: 15,
    flex: 1,
  },
  letter: {
    container: {
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
    messageContainer: {
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
    actionButtonsContainer: {flexDirection: 'row', justifyContent: 'flex-end'},
    seeLessOrMore: {
      title: {
        color: '#939393',
        fontSize: scaleFontSize(14),
        lineHeight: scaleFontSize(24),
      },
    },
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
});
