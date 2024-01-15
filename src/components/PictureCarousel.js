import React from 'react';
import {View, FlatList, Image, StyleSheet, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PictureCarousel = ({picURI}) => {
  return (
    <View>
      <FlatList
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment={'end'}
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
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
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
