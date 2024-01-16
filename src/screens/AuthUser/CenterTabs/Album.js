import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';

import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import PictureCarousel from '../../../components/PictureCarousel';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

import mockData from '../../../data/albumPosts.json';
import AlbumVideo from '../../../components/AlbumVideo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {albumCategoryMapping} from '../../../constants/albumCategoryMapping';

const Album = ({navigation}) => {
  const pageSize = 3;
  // const petID = useSelector(state => state.user.currentPetID);
  const [postsData, setPostsData] = useState({
    posts: [],
    nextToken: null,
  });
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(true);

  // useEffect(() => {
  //   fetchAlbum();
  // }, [petID]);

  // const fetchAlbum = async () => {
  //   queryPostsByPetIDPagination(
  //     isLoadingPosts,
  //     setIsLoadingPosts,
  //     listPosts,
  //     pageSize,
  //     petID,
  //     postsData.nextToken,
  //   ).then(data => {
  //     const {posts, nextToken: newNextToken} = data;
  //     setPostsData(prev => ({
  //       posts: [...prev.posts, ...posts],
  //       nextToken: newNextToken,
  //     }));
  //   });
  // };

  const renderDottedBorderButton = () => {
    return (
      isFetchComplete &&
      postsData.length === 0 && (
        <DashedBorderButton
          title={'추억 등록하기'}
          titleColor={'gray'}
          circleSize={30}
          onPress={() => navigation.navigate('ChooseMedia')}
        />
      )
    );
  };
  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      <FlatList
        style={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderDottedBorderButton}
        data={mockData}
        renderItem={({item}) => {
          return (
            <View style={styles.flatListItemContainer}>
              {item.type === 'photo' && <PictureCarousel picURI={item.uri} />}
              {item.type === 'video' && (
                <AlbumVideo source={item.uri[0]} width={320} height={568} />
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
      <View style={styles.plusButtonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate('ChooseMedia');
          }}>
          <AntDesign name={'pluscircle'} size={45} color={'#6395E1'} />
        </Pressable>
      </View>
    </View>
  );
};

export default Album;

const styles = StyleSheet.create({
  spacer: {paddingHorizontal: 15},
  plusButtonContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
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
