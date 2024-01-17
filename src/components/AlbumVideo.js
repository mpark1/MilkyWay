import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, View, Dimensions} from 'react-native';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AlbumVideo = ({source, width, height}) => {
  // source holds download link (retrieveS3Url)
  console.log('check video download link from S3: ', source);
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  const onTogglePlayVideo = () => {
    setIsVideoPaused(!isVideoPaused);
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          width: width > height ? '100%' : '65%',
          aspectRatio: width > height ? width / height + 0.3 : width / height,
        },
      ]}
      onPress={onTogglePlayVideo}>
      <Video
        source={{
          uri: source,
        }}
        style={styles.style}
        paused={isVideoPaused}
        resizeMode={'cover'}
        repeat={true}
      />
      {isVideoPaused && (
        <Pressable onPress={onTogglePlayVideo} style={styles.actionButton}>
          <AntDesign name={'playcircleo'} color={'#FFF'} size={40} />
        </Pressable>
      )}
      {/*{!isVideoPaused && (*/}
      {/*  <Pressable onPress={onTogglePlayVideo} style={styles.actionButton}>*/}
      {/*    <AntDesign name={'pause'} color={'#6395E1'} size={20} />*/}
      {/*  </Pressable>*/}
      {/*)}*/}
    </Pressable>
  );
};

export default AlbumVideo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  style: {
    position: 'absolute',
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
