import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import PictureCarousel from '../../../components/PictureCarousel';
import AlbumVideo from '../../../components/AlbumVideo';

import {
  fetchImageArrayFromS3,
  mutationItem,
  queryAlbumsByPetIDPagination,
} from '../../../utils/amplifyUtil';
import {albumCategoryMapping} from '../../../constants/albumCategoryMapping';
import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';
import {generateClient} from 'aws-amplify/api';
import {
  addUserDetailsToNewObj,
  fetchImageArrayForOneAlbumFromS3,
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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DeleteAlertBox from '../../../components/DeleteAlertBox';
import {deleteAlbum, deleteGuestBook} from '../../../graphql/mutations';
import {remove} from 'aws-amplify/storage';

const Album = ({navigation, route}) => {
  const {isFamily} = route.params;
  const pageSize = 3;
  const petID = useSelector(state => state.pet.id);
  const userId = useSelector(state => state.user.cognitoUsername);
  const [albumData, setAlbumData] = useState({
    albums: [],
    nextToken: null,
  });
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const [isAlbumFetchComplete, setIsAlbumFetchComplete] = useState(false);

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
    const createAlbumSub = petPageTabsSubscription(
      client,
      onCreateAlbum,
      'Create',
      processSubscriptionData,
      petID,
    );
    const deleteAlbumSub = petPageTabsSubscription(
      client,
      onDeleteAlbum,
      'Delete',
      processSubscriptionData,
      petID,
    );
    console.log(
      'create, update, delete subscriptions are on for Albums table.',
    );

    return () => {
      console.log('album subscriptions are turned off!');
      createAlbumSub.unsubscribe();
      deleteAlbumSub.unsubscribe();
    };
  }, []);

  async function processSubscriptionData(mutationType, data) {
    // setIsLetterFetchComplete(false);
    switch (mutationType) {
      case 'Create':
        // new album object from db
        const newAlbumObj = data.onCreateAlbum;
        console.log('print newly added album data: ', newAlbumObj);
        // add image array from s3
        const newAlbumObjWithImages = await fetchImageArrayForOneAlbumFromS3(
          newAlbumObj,
        );
        console.log(
          'print newly added album data with images: ',
          newAlbumObjWithImages,
        );
        setAlbumData(prev => ({
          ...prev,
          albums: [newAlbumObjWithImages, ...prev.albums],
        }));
        break;

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
      isCallingAPI,
      setIsCallingAPI,
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

  const deleteAlbumApi = async ({item}) => {
    Alert.alert('정말 삭제하시겠습니까?', '삭제 후 복구가 불가능합니다.', [
      {text: '취소'},
      {
        text: '삭제',
        onPress: async () => {
          const deleteAlbumInput = {
            petID: petID,
            createdAt: item.createdAt,
            id: item.id,
          };
          // remove an album folder in S3.
          try {
            item.keyArray.map(
              async s3key =>
                await remove({key: s3key, options: {accessLevel: 'protected'}}),
            );
          } catch (error) {
            console.log('Error while deleting an album folder in S3 ', error);
          }
          // remove an album item in Album table in db.
          await mutationItem(
            isCallingAPI,
            setIsCallingAPI,
            deleteAlbumInput,
            deleteAlbum,
            '앨범이 삭제되었습니다.',
            'none',
          );
        },
      },
    ]);
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

  const getAllImagesForCat = async () => {};

  const renderFlatListItem = useCallback(({item}) => {
    return (
      item.imageArray.length > 0 && (
        <View style={styles.flatListItemContainer}>
          {item.imageType === 0 ? (
            <PictureCarousel picURI={item.imageArray} />
          ) : (
            <AlbumVideo
              source={item.imageArray[0]}
              width={item.width}
              height={item.height}
            />
          )}
          <View style={styles.captionContainer}>
            <Text
              style={styles.tag}
              onPress={() => {
                getAllImagesForCat;
                console.log('tag pressed');
              }}>
              {albumCategoryMapping[item.category]}
            </Text>
            <View style={styles.captionAndIconWrapper}>
              <Text style={styles.caption}>
                {item.category !== 0 ? item.caption : item.caption}
              </Text>
              {userId === item.owner && (
                <Pressable
                  style={styles.trashCan}
                  onPress={async () => deleteAlbumApi({item})}>
                  <EvilIcons name={'trash'} color={'#373737'} size={26} />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      )
    );
  }, []);

  const renderAddNewAlbumButton = useCallback(() => {
    return (
      <View style={styles.plusButtonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate('ChooseMedia');
          }}>
          <AntDesign name={'pluscircle'} size={40} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  }, []);

  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      {isFamily && renderDottedBorderButton()}
      {isAlbumFetchComplete && albumData.albums.length > 0 && (
        <View style={styles.flatListContainer}>
          <FlatList
            onMomentumScrollBegin={() => setIsCallingAPI(false)}
            onEndReachedThreshold={0.8}
            onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}
            data={albumData.albums}
            renderItem={renderFlatListItem}
          />
          {isFamily && renderAddNewAlbumButton()}
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
    right: 5,
    bottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 50,
  },
  flatListContainer: {
    paddingTop: 15,
    flex: 1,
  },
  flatListItemContainer: {
    marginBottom: 15,
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  captionAndIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  caption: {
    color: '#374957',
    fontSize: scaleFontSize(18),
    marginLeft: 9,
    flexShrink: 1,
  },
  tag: {
    color: '#6395E1',
    fontSize: scaleFontSize(18),
  },
  trashCan: {
    paddingLeft: 5,
  },
});
