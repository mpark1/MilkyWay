import React, {useEffect, useRef, useState} from 'react';
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
import {generateClient} from 'aws-amplify/api';
import {
  addUserDetailsToNewObj,
  petPageTabsSubscription,
  processUpdateSubscription,
} from '../../../utils/amplifyUtilSubscription';
import {
  onCreateAlbum,
  onCreateLetter,
  onDeleteAlbum,
  onDeleteLetter,
  onUpdateAlbum,
  onUpdateLetter,
} from '../../../graphql/subscriptions';

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
  const albumDataRef = useRef(albumData.albums);

  useEffect(() => {
    console.log('this is Album tab. print redux: ', petID);
    const firstFetch = async () => {
      await fetchAlbums();
      console.log('Album tab is rendered');
      setIsAlbumFetchComplete(true);
    };
    firstFetch();
  }, [petID]);

  useEffect(() => {
    const client = generateClient();
    // create mutation
    const createSub = petPageTabsSubscription(
      client,
      onCreateAlbum,
      'Create',
      processSubscriptionData,
      petID,
    );
    const updateSub = petPageTabsSubscription(
      client,
      onUpdateAlbum,
      'Update',
      processSubscriptionData,
      petID,
    );
    const deleteSub = petPageTabsSubscription(
      client,
      onDeleteAlbum,
      'Delete',
      processSubscriptionData,
      petID,
    );
    console.log(
      'create, update, delete subscriptions are on for Letters table.',
    );

    return () => {
      console.log('album subscriptions are turned off!');
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, []);

  async function processSubscriptionData(mutationType, data) {
    // setIsLetterFetchComplete(false);
    switch (mutationType) {
      case 'Create':
        const newAlbumObj = data.onCreateAlbum;
        console.log('print newly added album data: ', newAlbumObj);
        setAlbumData(prev => ({
          ...prev,
          albums: [newAlbumObj, ...prev.albums],
        }));
        break;

      // case 'Update':
      //   const updatedAlbumObj = data.onUpdateAlbum;
      //   const currentAlbums = albumDataRef.current;
      //   const updatedAlbumsArray = await processUpdateSubscription(
      //     currentAlbums,
      //     updatedAlbumObj,
      //   );
      //   setAlbumData(prev => ({
      //     ...prev,
      //     albums: updatedAlbumsArray,
      //   }));
      //   break;

      case 'Delete':
        const deleteAlbum = data.onDeleteAlbum;
        setAlbumData(prev => ({
          ...prev,
          albums: prev.albums.filter(album => album.id !== deleteAlbum.id),
        }));
        break;
    }
    // setIsLetterFetchComplete(true);
  }
  const fetchAlbums = async () => {
    await queryAlbumsByPetIDPagination(
      isLoadingAlbums,
      setIsLoadingAlbums,
      pageSize,
      petID,
      albumData.nextToken,
    ).then(data => {
      const {albums, nextToken: newNextToken} = data;
      albums.length !== 0 &&
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
                item.imageArray.length > 0 && (
                  <View style={styles.flatListItemContainer}>
                    {item.imageType === 0 ? (
                      <PictureCarousel picURI={item.imageArray} />
                    ) : (
                      <AlbumVideo
                        source={item.imageArray[0]}
                        width={300}
                        height={300}
                        // width={parseInt(item.metadata.width, 10)}
                        // height={parseInt(item.metadata.height, 10)}
                      />
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
                )
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
