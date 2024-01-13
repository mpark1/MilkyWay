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
          uri: 'https://animalworldapp-storage-c3f2827d181726-dev.s3.ap-northeast-2.amazonaws.com/protected/ap-northeast-2%3Aa5ef2bc3-ccc6-49e4-a879-41260a8b6dc7/album/albumId/9dc331bf-2a56-4d3c-8822-24a4d1c77786.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAO1V7WPGjdN%2FooWdH6k334OhPBHZMwEH0%2FKKwiobPxfEAiEA%2BGszvgpllhGnSKXVaedW%2Fn5pjSAhHODJlmWEgSIfzdcq5AIIOxAAGgw4NDQzMjkwNzM1MzciDPPGx%2FOSN7SWEP2v8SrBAglnCjH7Y%2FX8ZeWgLfTG7bJj2Mh6UAQZf5aPSUTp4SzdpbuIgMOF63wet1ThS5tzBnd%2Bx%2BzfmAl28R8r4C9e4Rxjihy1IAXIUtEcOUVke2QsGGGCpylgX%2B1HqSEXEK8J%2FHQYDIdI4w9p49WTxVXYs2FNtHoXUc%2Fpxurs%2F6t3XarfRPVF3X4S%2BLJPSILVEoEcDkyJSWlOoY1E5RgMTB%2BGmYXFrbiLRN6selOlsRFDyZlCLLlXwMiq9f3Rvmb%2FHTl5B0xRAIvHx7uYC2lYW1Vh01DYmDhrxtN3ugwGotVjbsMNWF0z1QAzdXrR2NwIRokAw7p%2BY2RoID1O19I00UvjqC%2F0grcZGltO4W5j4TfqvnWgkhI3XZr8ThJwWXrTYC8aFn6SV3PkcIsOWBI6vEuSEvbN6e2xCeTS2dE1NkwfIQaewzDPs4KtBjqyAlomsNphxR8DOTc0ektS%2F1QSe7NSAj8GEXxaB6r8NEgp4QHPsBtn1NOkg6mUaI0l%2FiKc7%2F6JdAFo2CMRFeW8y6k14k3Ym%2B3t%2FEaE1PovzjA5uMJJ6jfrAAxZxidSD35Gf6SRszKssuabDBdsPLxJv7C5nVX3vwOsGp7%2BVQgjgGnmIbMxIDqn%2BcLS3Q6bRtNWh5GdyT5EQB4GZGPg3f9oYmz71NHXBNKz4j7NoakeYjBiLgdKEhAinLy2m35vLxkVzLvMgoNbhMV0%2BRI2FshRw3%2Bbs56Xtz6I1vNQlhHs%2FzfxD7WZtgObU9X3DY6TXO1Mj0rRQm%2F%2B3Lo9RdSNtKisSsi2HRveF2Y0n6muKMnsSa2PtXs28yyY8yqCgjUluaBZV3rcasNDLOQcE%2BQ5cikTTi4VRw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240112T081306Z&X-Amz-SignedHeaders=host&X-Amz-Expires=18000&X-Amz-Credential=ASIA4JFPPHOARUYOBNPB%2F20240112%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=1cb636eace4c7dcf1ad6968831aac7e7c265622874a712237166250d2e66cc63',
        }}
        style={styles.style}
        paused={isVideoPaused}
        resizeMode={'contain'}
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
    width: '60%',
    height: '80%',
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
