import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, View, Dimensions} from 'react-native';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AlbumVideo = ({source, width, height}) => {
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
          uri: 'https://animalworldapp-storage-c3f2827d181726-dev.s3.ap-northeast-2.amazonaws.com/protected/ap-northeast-2%3Aa5ef2bc3-ccc6-49e4-a879-41260a8b6dc7/album/albumId/pexels-artem-podrez-6466669%20%282160p%29.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhANwmdT2vBy8%2BGa07GhPy8DPSAJ4V55KjWwXJJ9cfOKIzAiEAjHO%2FJZ7zm31PtBfqPwv1lTz723Syat8%2F%2FL4kDnsAiRQq7QIIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw4NDQzMjkwNzM1MzciDGFcpJCTYT0FU0sA0yrBAmmjLNNYxrl%2BbeWXLX%2BqIB6I%2FiMBAt3nEXziJ%2FnsAkDuy2CtgOj0dMBeDV3edz6xd9agJEvuJtd5A%2BUml08Z6ELQkZ7L55GJsULGwlhDjbQTYVKwWDzXUCzriljTMqPjre%2BRfz9cO%2Bat3lU7zqPKibXvtLSJ9aTbwOu3PwP4SKSQ43tyur0svJA0x420vpIP2xK8maTuEpWdHyVzDodBdFW1PKNYqF2CKffW%2FQvVgWAmFfajOTu701ebHDUCpGF5KAJzrQDbYgUp2XggsimyNgA6TNT5nqXIXF3aCo4thmutGfd5ADyvSztOs%2FfFRfusB%2FfhDEutMtj0ClVLTEZU7BnkcjoFeUChccyhfMJ3ZoZHmFTCwANHAPFCG9Cz3MsS4YglJfiky9tOaW5YKdTE8y5TqMvBq1WRw%2FSTb2JrCbizizCn2JmtBjqyAu3sl0w0ny3SlkwKCODjjNLOAnOXxZI9wKNzbf%2BlFaEYS1VteJ7RFA5gTpTwNm7GgA3pvTF8ibOnf%2B3PhBIkcz2yCzDmQb0wKF%2B%2FJsa8JcTzZk%2BGXlUoa1hxvviar9eFv08RCDHj0LQncmy%2Bj9PP8GzEXNm%2BGaBjX6CGlSArq9d9KjmzLm%2FfyQjWeibcOapjFmd0bVWVj8yYepel0o694EWZRnq%2BUVo%2FmCfO5Lnrqop5MzlPQptiud8uxxMY7MdYIX3U0Q56TzlHl9iD%2BJNDtJgANcmTbkNXGqLBrpajzFHC5Z6gJuqClozoj%2FlyDfZ2dKWE4Hml2LUNqOL4%2F%2BAgQ%2Bs%2FVxntdN6NpYLp3puoKlld6GzKh4HIU9LVhQrVRapqpASPViUk5Kb7WTgbEk4S5BPl6g%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240116T122413Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Credential=ASIA4JFPPHOAXQW4MN77%2F20240116%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=d3346ba635df2fa66b383719312eb4351323b4a1ca4cd9ede5df84142ea6b02d',
          // uri: 'https://animalworldapp-storage-c3f2827d181726-dev.s3.ap-northeast-2.amazonaws.com/protected/ap-northeast-2%3Aa5ef2bc3-ccc6-49e4-a879-41260a8b6dc7/album/albumId/9dc331bf-2a56-4d3c-8822-24a4d1c77786.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhANwmdT2vBy8%2BGa07GhPy8DPSAJ4V55KjWwXJJ9cfOKIzAiEAjHO%2FJZ7zm31PtBfqPwv1lTz723Syat8%2F%2FL4kDnsAiRQq7QIIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw4NDQzMjkwNzM1MzciDGFcpJCTYT0FU0sA0yrBAmmjLNNYxrl%2BbeWXLX%2BqIB6I%2FiMBAt3nEXziJ%2FnsAkDuy2CtgOj0dMBeDV3edz6xd9agJEvuJtd5A%2BUml08Z6ELQkZ7L55GJsULGwlhDjbQTYVKwWDzXUCzriljTMqPjre%2BRfz9cO%2Bat3lU7zqPKibXvtLSJ9aTbwOu3PwP4SKSQ43tyur0svJA0x420vpIP2xK8maTuEpWdHyVzDodBdFW1PKNYqF2CKffW%2FQvVgWAmFfajOTu701ebHDUCpGF5KAJzrQDbYgUp2XggsimyNgA6TNT5nqXIXF3aCo4thmutGfd5ADyvSztOs%2FfFRfusB%2FfhDEutMtj0ClVLTEZU7BnkcjoFeUChccyhfMJ3ZoZHmFTCwANHAPFCG9Cz3MsS4YglJfiky9tOaW5YKdTE8y5TqMvBq1WRw%2FSTb2JrCbizizCn2JmtBjqyAu3sl0w0ny3SlkwKCODjjNLOAnOXxZI9wKNzbf%2BlFaEYS1VteJ7RFA5gTpTwNm7GgA3pvTF8ibOnf%2B3PhBIkcz2yCzDmQb0wKF%2B%2FJsa8JcTzZk%2BGXlUoa1hxvviar9eFv08RCDHj0LQncmy%2Bj9PP8GzEXNm%2BGaBjX6CGlSArq9d9KjmzLm%2FfyQjWeibcOapjFmd0bVWVj8yYepel0o694EWZRnq%2BUVo%2FmCfO5Lnrqop5MzlPQptiud8uxxMY7MdYIX3U0Q56TzlHl9iD%2BJNDtJgANcmTbkNXGqLBrpajzFHC5Z6gJuqClozoj%2FlyDfZ2dKWE4Hml2LUNqOL4%2F%2BAgQ%2Bs%2FVxntdN6NpYLp3puoKlld6GzKh4HIU9LVhQrVRapqpASPViUk5Kb7WTgbEk4S5BPl6g%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240116T114546Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIA4JFPPHOAXQW4MN77%2F20240116%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=de778fa7b90f4f7032f6e54ef9370be16c941c5576f9e41465fb275b91e45a0c',
        }}
        style={styles.style}
        paused={isVideoPaused}
        resizeMode={'contain'}
        repeat={true}
      />
      {isVideoPaused && (
        <Pressable onPress={onTogglePlayVideo} style={styles.actionButton}>
          <AntDesign name={'playcircleo'} color={'#FFF'} size={40} />
        </Pressable>
      )}
    </Pressable>
  );
};

export default AlbumVideo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  style: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 5,
    backgroundColor: 'yellow',
  },
  actionButton: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
