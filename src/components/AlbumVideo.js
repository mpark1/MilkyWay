import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, View, Dimensions} from 'react-native';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AlbumVideo = ({source}) => {
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  const onTogglePlayVideo = () => {
    setIsVideoPaused(!isVideoPaused);
  };

  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        style={styles.style}
        paused={isVideoPaused}
        resizeMode={'cover'}
        repeat={true}
      />
      {isVideoPaused && (
        <Pressable onPress={onTogglePlayVideo} style={styles.actionButton}>
          <AntDesign name={'playcircleo'} color={'#6395E1'} size={40} />
        </Pressable>
      )}
      {!isVideoPaused && (
        <Pressable onPress={onTogglePlayVideo} style={styles.actionButton}>
          <AntDesign name={'pause'} color={'#6395E1'} size={20} />
        </Pressable>
      )}
    </View>
  );
};

export default AlbumVideo;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4,
    justifyContent: 'center',
  },
  style: {
    position: 'absolute',
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 5,
  },
  actionButton: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
