import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import PictureCarousel from '../../../components/PictureCarousel';
import AlbumVideo from '../../../components/AlbumVideo';

import {queryAlbumsByPetIDPagination} from '../../../utils/amplifyUtil';
import {albumCategoryMapping} from '../../../constants/albumCategoryMapping';
import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

const Album = ({navigation, route}) => {
  const {isFamily} = route.params;
  const pageSize = 3;
  const petID = useSelector(state => state.pet.id);
  const [albumData, setAlbumData] = useState({
    albums: [],
    nextToken: null,
  });
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(false);
  const [isAlbumFetchComplete, setIsAlbumFetchComplete] = useState(false);

  useEffect(() => {
    const firstFetch = async () => {
      await fetchAlbums();
      console.log('Album tab is rendered');
      setIsAlbumFetchComplete(true);
    };
    firstFetch();
  }, [petID]);

  const fetchAlbums = async () => {
    await queryAlbumsByPetIDPagination(
      isLoadingAlbums,
      setIsLoadingAlbums,
      pageSize,
      petID,
      albumData.nextToken,
    ).then(data => {
      const {albums, nextToken: newNextToken} = data;
      setAlbumData(prev => ({
        albums: [...prev.albums, ...albums],
        nextToken: newNextToken,
      }));
    });
  };

  const renderDottedBorderButton = () => {
    return (
      isAlbumFetchComplete &&
      albumData.albums.length === 0 && (
        <View style={{paddingTop: 15}}>
          <DashedBorderButton
            title={'추억 등록하기'}
            titleColor={'gray'}
            circleSize={30}
            onPress={() => navigation.navigate('ChooseMedia')}
          />
        </View>
      )
    );
  };

  const onEndReached = async () => {
    if (albumData.nextToken !== null) {
      await fetchAlbums();
    }
  };

  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      {isFamily && renderDottedBorderButton()}
      {isAlbumFetchComplete && albumData.albums.length > 0 && (
        <View style={styles.flatListContainer}>
          <FlatList
            onMomentumScrollBegin={() => setIsLoadingAlbums(false)}
            onEndReachedThreshold={0.8}
            onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}
            data={albumData.albums}
            renderItem={({item}) => {
              return (
                <View style={styles.flatListItemContainer}>
                  {item.imageType === 0 ? (
                    <PictureCarousel picURI={item.imageArray} />
                  ) : (
                    <AlbumVideo source={item.imageArray[0]} />
                  )}
                  <View>
                    <Text style={[styles.caption, {marginVertical: 10}]}>
                      {item.category !== 0
                        ? '                 ' + item.caption
                        : item.caption}
                    </Text>
                    <Text
                      style={styles.tag}
                      onPress={() => {
                        // 태그별 모아보기용 쿼리 부르기
                        console.log('tag pressed');
                      }}>
                      {albumCategoryMapping[item.category]}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
          {isFamily && (
            <View style={styles.plusButtonContainer}>
              <Pressable
                onPress={() => {
                  navigation.navigate('ChooseMedia');
                }}>
                <AntDesign name={'pluscircle'} size={40} color={'#6395E1'} />
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Album;

const styles = StyleSheet.create({
  spacer: {paddingHorizontal: 15},
  plusButtonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 50,
  },
  flatListContainer: {
    paddingVertical: 15,
    flex: 1,
  },
  flatListItemContainer: {
    marginBottom: 10,
  },
  caption: {
    color: '#374957',
    fontSize: scaleFontSize(16),
    lineHeight: scaleFontSize(20),
  },
  tag: {
    position: 'absolute',
    top: 10,
    color: '#6395E1',
    fontSize: scaleFontSize(16),
    marginBottom: 10,
  },
});
