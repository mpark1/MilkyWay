import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PictureCarousel = ({picURI}) => {
  return (
    <View>
      <FlatList
        horizontal={true}
        scrollEnabled={picURI.length > 2}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment={'center'}
        decelerationRate={'fast'}
        pagingEnabled={true}
        scrollEventThrottle={16}
        data={picURI}
        renderItem={({item}) => {
          return (
            <View style={styles.carouselEntryContainer}>
              <Image
                style={styles.img}
                resizeMode={'cover'}
                source={{uri: item}}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default PictureCarousel;

const styles = StyleSheet.create({
  carouselEntryContainer: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.5,
    marginRight: 5,
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  dotsContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dots: {
    width: 5,
    height: 5,
    marginHorizontal: 3,
    borderRadius: 5 / 2,
  },
});
