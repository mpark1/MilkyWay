import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import Video from 'react-native-video';

import AntDesign from 'react-native-vector-icons/AntDesign';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import BlueButton from '../../components/Buttons/BlueButton';

import ages from '../../data/albumCategories.json';
import {
  getIdentityID,
  mutationItem,
  uploadImageToS3,
} from '../../utils/amplifyUtil';
import {useSelector} from 'react-redux';
import {Video as VideoCompressor} from 'react-native-compressor';
import {createAlbum, createImage} from '../../graphql/mutations';
import {generateClient} from 'aws-amplify/api';
import {albumCategory} from '../../constants/albumCategoryMapping';
import {getUrl, list} from 'aws-amplify/storage';
import AlertBox from '../../components/AlertBox';

const MediaPreview = ({navigation, route}) => {
  const {isPhoto, mediaList: initialMediaList, category} = route.params;
  const petID = useSelector(state => state.pet.id);

  const [mediaList, setMediaList] = useState(initialMediaList);
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  console.log('imageList: ', mediaList);

  const [isDropDownPickerOpen, setIsDropDownPickerOpen] = useState(false);
  const ageOptions = ages.map(item => ({
    label: item,
    value: item,
  }));
  const [newCategory, setNewCategory] = useState(category);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [description, setDescription] = useState('');
  const canGoNext = newCategory && mediaList.length > 0;
  const [s3Images, setS3Images] = useState([]);

  const onChangeDescription = useCallback(text => {
    setDescription(text);
  }, []);

  const handleRemoveImage = index => {
    const updatedList = [...mediaList];
    updatedList.splice(index, 1);
    setMediaList(updatedList);
  };

  const onTogglePlayVideo = () => {
    setIsVideoPaused(!isVideoPaused);
  };

  const compressVideoAndConvertToBlob = async () => {
    const video = mediaList[0];
    try {
      console.log(video.uri);
      const resFromCompressor = await VideoCompressor.compress(video.uri, {
        compressionMethod: 'auto',
      });
      console.log('resultFromCompressor', resFromCompressor);
      const compressedVideo = await fetch(resFromCompressor);
      const videoBlob = await compressedVideo.blob();
      console.log('videoBlob: ', videoBlob);
      return videoBlob;
    } catch (error) {
      console.log('Error while converting video to blob: ', error);
    }
  };

  const renderCategoryField = () => {
    return (
      <View style={styles.ageField}>
        <Text style={styles.label}>카테고리</Text>
        <DropDownPicker
          containerStyle={styles.dropDownPicker.containerStyle}
          style={styles.dropDownPicker.borderStyle}
          dropDownContainerStyle={styles.dropDownPicker.borderStyle}
          multiple={false}
          placeholderStyle={styles.dropDownPicker.placeholder}
          placeholder={'선택'}
          items={ageOptions}
          value={newCategory}
          setValue={setNewCategory}
          open={isDropDownPickerOpen}
          setOpen={setIsDropDownPickerOpen}
          listMode={'SCROLLVIEW'}
        />
      </View>
    );
  };

  const renderImageFlatList = useCallback(() => {
    return (
      <FlatList
        scrollEnabled={false}
        numColumns={2}
        data={mediaList}
        renderItem={({item, index}) => {
          return (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                resizeMode={'cover'}
                source={{uri: item.uri}}
              />
              <Pressable
                style={styles.closeCircle}
                onPress={() => handleRemoveImage(index)}>
                <AntDesign name="closecircle" size={20} color={'#6395E1'} />
              </Pressable>
            </View>
          );
        }}
      />
    );
  }, [mediaList]);

  const renderEmptyImageList = () => {
    return (
      <View style={styles.noImagesOrVideo.container}>
        <Text style={styles.noImagesOrVideo.text}>
          {
            '선택된 사진이 없습니다.\n\n이전 화면으로 돌아가 앨범에 등록할 사진을 선택해주세요.'
          }
        </Text>
      </View>
    );
  };

  const renderVideo = () => {
    return (
      <View style={styles.video.container}>
        <Video
          source={{
            uri: mediaList[0].uri, // 영상은 1개만 가능
          }}
          style={styles.video.style}
          paused={isVideoPaused}
          resizeMode={'cover'}
          repeat={true}
        />
        {isVideoPaused ? (
          <Pressable
            onPress={onTogglePlayVideo}
            style={styles.video.actionButton}>
            <AntDesign name={'playcircleo'} color={'#FFF'} size={50} />
          </Pressable>
        ) : (
          <Pressable
            onPress={onTogglePlayVideo}
            style={styles.video.actionButton}>
            <AntDesign name={'pause'} color={'#FFF'} size={30} />
          </Pressable>
        )}
      </View>
    );
  };

  const renderStoryField = () => {
    return (
      <View>
        <Text style={[styles.label, {paddingBottom: 16}]}>스토리</Text>
        <TextInput
          style={styles.story.textInput}
          onChangeText={onChangeDescription}
          placeholder={'사진을 보면 떠오르는 추억이 있나요? (최대 60자)'}
          placeholderTextColor={'#939393'}
          textAlign={'left'}
          textAlignVertical={'top'}
          multiline={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          clearButtonMode={'while-editing'}
          maxLength={60}
          scrollEnabled={true}
        />
      </View>
    );
  };

  function navigationPage() {
    navigation.pop(2);
  }

  const onSubmit = async () => {
    // get author's identity ID
    const identityId = await getIdentityID();
    // 1. create a new album item
    const newAlbumInput = {
      petID: petID,
      category: albumCategory[newCategory], // category: Int!
      caption: description,
      authorIdentityID: identityId,
      imageType: isPhoto ? 0 : 1,
    };

    try {
      if (!isCallingAPI) {
        setIsCallingAPI(true);
        const client = generateClient();
        const response = await client.graphql({
          query: createAlbum,
          variables: {input: newAlbumInput},
          authMode: 'userPool',
        });
        console.log('response after create album ', response);
        const albumID = response.data.createAlbum.id;

        mediaList.map(async item => {
          let videoBlob;
          if (!isPhoto) {
            videoBlob = await compressVideoAndConvertToBlob();
          }
          console.log('item inside onSubmit: ', item);
          const s3Result = await uploadImageToS3(
            'album/' + albumID + '/' + item.filename,
            isPhoto ? item.blob : videoBlob,
            item.contentType,
          );
          console.log('print s3 result value: ', s3Result);
        });
        AlertBox(
          '앨범이 성공적으로 등록되었습니다.',
          '',
          '확인',
          navigationPage,
        );
      }
    } catch (error) {
      console.log('error during query: ', error);
    } finally {
      setIsCallingAPI(false);
    }
  };

  const renderSubmitButton = () => {
    return (
      <View style={styles.submitButton}>
        <BlueButton
          title={'등록하기'}
          disabled={!canGoNext}
          onPress={onSubmit}
        />
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderCategoryField()}
        <Text style={styles.label}>{isPhoto ? '사진' : '영상'}</Text>
        {isPhoto ? (
          <View style={styles.flatListContainer}>
            {mediaList.length > 0
              ? renderImageFlatList()
              : renderEmptyImageList()}
          </View>
        ) : (
          renderVideo()
        )}
        {renderStoryField()}
        {renderSubmitButton()}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MediaPreview;

const styles = StyleSheet.create({
  spacer: {paddingTop: 10, paddingHorizontal: 20},
  ageField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Dimensions.get('window').height * 0.03,
    zIndex: 1,
  },
  label: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#000',
  },
  dropDownPicker: {
    containerStyle: {
      width: '60%',
      maxHeight: 30,
    },
    borderStyle: {
      borderRadius: 5,
      borderColor: '#d9d9d9',
      minHeight: 30,
    },
    placeholder: {
      color: '#939393',
      fontSize: scaleFontSize(16),
      backgroundColor: '#FFF',
    },
  },
  flatListContainer: {
    width: '100%',
    marginBottom: Dimensions.get('window').height * 0.03,
  },
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
  },
  video: {
    container: {
      width: Dimensions.get('window').width * 0.8,
      height: Dimensions.get('window').width * 0.8,
      alignSelf: 'center',
      justifyContent: 'center',
      marginBottom: Dimensions.get('window').height * 0.03,
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
  },
  closeCircle: {
    position: 'absolute',
    right: -7,
    top: -7,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  noImagesOrVideo: {
    container: {
      backgroundColor: '#EEEEEE',
      padding: 10,
      borderRadius: 5,
      marginBottom: Dimensions.get('window').height * 0.03,
    },
    text: {
      fontSize: scaleFontSize(16),
      color: '#000',
    },
  },
  story: {
    textInput: {
      width: '100%',
      height: Dimensions.get('window').height * 0.1,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#d9d9d9',
      paddingHorizontal: 10,
      fontSize: scaleFontSize(16),
      lineHeight: scaleFontSize(24),
      color: '#000',
    },
  },
  submitButton: {
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.03,
    marginBottom: Dimensions.get('window').height * 0.05,
  },
});
