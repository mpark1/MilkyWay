import React, {useState} from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import BlueButton from '../components/Buttons/BlueButton';
import {uploadImageToS3} from '../utils/amplifyUtil';
import uuid from 'react-native-uuid';
import {getUrl, list} from 'aws-amplify/storage';
import {useSelector} from 'react-redux';

const SamplePage = ({navigation, route}) => {
  const {mediaList} = route.params;
  const userID = useSelector(state => state.user.cognitoUsername);
  // const albumID = uuid.v4();
  // console.log('print albumID: ', albumID);
  const filename = mediaList[0].filename;
  const uri = mediaList[0].uri;
  const photoBlob = mediaList[0].blob;
  console.log('print filename & uri: ', filename, uri);
  const [s3Images, setS3Images] = useState([]);
  const [singleImage, setSingleImage] = useState('');

  const retrieveImage = async () => {
    // setSingleImage(
    //   'https://milkywayde81bc1ad1ab4e048cd7b09af4ac1c3d114256-dev.s3.ap-northeast-2.amazonaws.com/protected/ap-northeast-2%3A8ef16ae2-65f2-42bb-8dda-a05f9c8e8b81/album/2da15ea9-ac30-4251-8476-8e768ccdaaa4.jpg',
    // );
    try {
      // returns all image objects from s3 bucket
      const getUrlResult = await getUrl({
        key: 'album/b2a5f94b-a06e-4a93-b44b-ef4a6e8a8680.jpeg',
        options: {
          // accessLevel: 'public', // can be 'private', 'protected', or 'guest' but defaults to `guest`
          // targetIdentityId: userID, // id of another user, if `accessLevel` is `guest`
          validateObjectExistence: false, // defaults to false
          expiresIn: 100, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
          useAccelerateEndpoint: false, // Whether to use accelerate endpoint.
        },
      });
      console.log('print a single image url result', getUrlResult.url);
      setSingleImage(getUrlResult.url);
    } catch (error) {
      console.log('print error for retrieving one image', error);
    }
  };
  const retrieveImagesfromS3 = async () => {
    try {
      // returns all image objects from s3 bucket
      const response = await list({
        prefix: 'album/',
        options: {
          accessLevel: 'public',
        },
      });
      console.log('retrieved photo objects from S3:', response.items);

      const urlPromises = response.items.map(async imageObj => {
        const getUrlResult = await getUrl({
          key: imageObj.key,
          options: {
            // accessLevel: 'protected', // can be 'private', 'protected', or 'guest' but defaults to `guest`
            // targetIdentityId: userID,
            validateObjectExistence: false, // defaults to false
            expiresIn: 900, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
            useAccelerateEndpoint: false, // Whether to use accelerate endpoint.
          },
        });
        return getUrlResult.url.href;
      });
      // save return arrays to the useState.
      const returnImagesArray = await Promise.all(urlPromises);
      console.log(
        'print first retrieved urls type: ',
        typeof returnImagesArray[0],
      );
      setS3Images(returnImagesArray);
      // setSingleImage(returnImagesArray[0]);
    } catch (error) {
      console.log('Error ', error);
    }
  };

  return (
    <View>
      <BlueButton
        title={'사진 S에 올리기'}
        onPress={() => uploadImageToS3(filename, photoBlob, 'image/jpeg')}
      />
      <BlueButton
        title={'사진들 가져오기'}
        onPress={() => {
          retrieveImagesfromS3();
        }}
      />
      {/*{singleImage && (*/}
      {/*  <View style={styles.imageContainer}>*/}
      {/*    <Image*/}
      {/*      // key={oneImage}*/}
      {/*      style={styles.image}*/}
      {/*      resizeMode={'cover'}*/}
      {/*      source={{uri: singleImage}}*/}
      {/*      onError={e =>*/}
      {/*        console.log('Error loading image:', e.nativeEvent.error)*/}
      {/*      }*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*)}*/}

      {s3Images &&
        s3Images.map(oneImage => {
          return (
            <View style={styles.imageContainer}>
              <Image
                key={oneImage}
                style={styles.image}
                resizeMode={'cover'}
                source={{
                  uri: oneImage,
                }}
                onError={e =>
                  console.log('Error loading image:', e.nativeEvent.error)
                }
              />
            </View>
          );
        })}
    </View>
  );
};

export default SamplePage;

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get('window').width * 0.42,
    height: Dimensions.get('window').width * 0.42,
    marginRight: 13,
    marginVertical: 13 / 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    borderWidth: 1,
  },
});
