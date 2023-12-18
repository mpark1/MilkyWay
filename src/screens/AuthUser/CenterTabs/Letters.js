import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import {useSelector} from 'react-redux';
import {listLetters} from '../../../graphql/queries';
import MoreLessTruncated from '../../../components/MoreLessTruncated';
import {queryListItemsByPetIDPagination} from '../../../utils/amplifyUtil';

const Letters = ({navigation}) => {
  const pageSize = 3;
  const petID = useSelector(state => state.user.currentPetID);
  const [lettersData, setLettersData] = useState({
    letters: [],
    nextToken: null,
  });
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);

  useEffect(() => {
    fetchLetters();
  }, [petID]);

  const fetchLetters = async () => {
    queryListItemsByPetIDPagination(
      isLoadingLetters,
      setIsLoadingLetters,
      listLetters,
      pageSize,
      petID,
      lettersData.nextToken,
    ).then(data => {
      const {items, nextToken: newNextToken} = data.listLetters;
      setLettersData(prev => ({
        letters: [...prev.letters, ...items],
        nextToken: newNextToken,
      }));
    });
  };

  const renderFlatListItem = useCallback(({item}) => {
    return (
      <MoreLessTruncated item={item} linesToTruncate={2} whichTab={'Letters'} />

      // <View style={styles.letter.container}>
      //   <Text style={styles.letter.title}>{item.title}</Text>
      //   <View style={styles.letter.flexDirectionRow}>
      //     <View style={styles.letter.profilePicContainer}>
      //       <Image
      //         style={styles.letter.profilePic}
      //         source={{
      //           uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzEyMTZfNTIg/MDAxNTEzMzk4OTI1NTY5.Adb0MbO3WwvlP51KiOgKWPcPyRUYh7pbP1L5Zrp45lIg.Emli51gG8JdC7p-ooJBiYvcRvaP-sNnffoHejVLqGkYg.JPEG.samusiltour/_MG_8261.JPG?type=w800',
      //         }}
      //       />
      //     </View>
      //     <View style={styles.letter.messageContainer}>
      //       <View style={styles.letter.nameRelationshipDateContainer}>
      //         <Text style={styles.letter.name}>
      //           {item.name}
      //           {'   '}
      //         </Text>
      //         <Text style={styles.letter.relationshipAndDate}>
      //           {item.relationship} ({item.timestamp.substring(0, 10)})
      //         </Text>
      //       </View>
      //       <ReadMoreText
      //         style={styles.letter.content}
      //         numberOfLines={2}
      //         readMoreText={' 더보기'}
      //         readLessText={' 닫기'}
      //         readMoreStyle={styles.letter.seeLessOrMore.title}
      //         readLessStyle={styles.letter.seeLessOrMore.title}>
      //         {item.content}
      //       </ReadMoreText>
      //
      //     </View>
      //   </View>
      // </View>
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
          onPress={() => navigation.navigate('WriteLetter')}
        />
      </View>
    );
  }, []);

  const onEndReached = async () => {
    if (lettersData.nextToken !== null) {
      await fetchLetters();
    }
  };

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => setIsLoadingLetters(false)}
        onEndReachedThreshold={0.8}
        onEndReached={onEndReached}
        data={lettersData.letters}
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
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
});
