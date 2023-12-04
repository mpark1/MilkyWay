import React, {useCallback, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';

import {pagination} from '../../../utils/pagination';

import ShortLetterPreview from '../../../components/Letters/ShortLetterPreview';

import mockData from '../../../data/familyLetters.json';
import LongLetterPreview from '../../../components/Letters/LongLetterPreview';
import {Button} from '@rneui/base';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Letters = ({navigation}) => {
  const pageSize = 2;
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedLetters, setRenderedLetters] = useState(mockData.slice(0, 2));
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);

  const renderFlatListItem = useCallback(({item}) => {
    console.log('렌더링...', item.name);
    return item.content.length > 60 ? (
      <LongLetterPreview
        profilePic={item.profilePic}
        title={item.title}
        relationship={item.relationship}
        name={item.name}
        content={item.content}
        timestamp={item.timestamp}
      />
    ) : (
      <ShortLetterPreview
        profilePic={item.profilePic}
        title={item.title}
        relationship={item.relationship}
        name={item.name}
        content={item.content}
        timestamp={item.timestamp}
      />
    );
  }, []);

  const renderWriteLetterButton = useCallback(() => {
    const plusButton = (
      <View style={styles.plusButtonContainer}>
        <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
      </View>
    );
    return (
      <Button
        title={'편지쓰기'}
        titleStyle={{
          color: '#939393',
        }}
        containerStyle={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: '#939393',
          alignSelf: 'center',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
        buttonStyle={{backgroundColor: 'transparent'}}
        onPress={() =>
          navigation.navigate('WriteOrEditLetter', {
            actionType: 'write',
            title: '',
            relationship: '',
            isPrivate: false,
            message: '',
          })
        }
        icon={plusButton}
      />
    );
  }, []);

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        onMomentumScrollBegin={() => setIsLoadingLetters(false)}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!isLoadingLetters) {
            setIsLoadingLetters(true);
            setRenderedLetters(prev => [
              ...prev,
              ...pagination(mockData, pageNumber + 1, pageSize, setPageNumber),
            ]);
            setIsLoadingLetters(false);
          }
        }}
        data={renderedLetters}
        renderItem={renderFlatListItem}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: '#FFF',
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}>
        {renderWriteLetterButton()}
      </View>
    </View>
  );
};

export default Letters;

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: '#FFF',
    paddingBottom: 70,
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
});
