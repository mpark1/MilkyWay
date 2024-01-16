import React, {memo, useCallback, useMemo, useState} from 'react';
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

import albumCategories from '../../data/albumCategories.json';

const MediaPreview = ({navigation, route}) => {
  const {isPhoto, mediaList: initialMediaList, category} = route.params;
  const [mediaList, setMediaList] = useState(initialMediaList);
  console.log('mediaList: ', mediaList);

  const [isDropDownPickerOpen, setIsDropDownPickerOpen] = useState(false);
  const categories = albumCategories.map(item => ({
    label: item,
    value: item,
  }));
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [description, setDescription] = useState('');
  const canGoNext = selectedCategory && mediaList.length > 0;
  const [isCallingAPI, setIsCallingAPI] = useState(false);

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
          items={categories}
          value={selectedCategory}
          setValue={setSelectedCategory}
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

  const renderVideo = useCallback(() => {
    const aspectRatio = mediaList[0].width / mediaList[0].height;
    const isLandscape = mediaList[0].width > mediaList[0].height;

    return (
      <View
        style={[
          styles.video.container,
          {
            width: isLandscape ? '100%' : '65%',
            aspectRatio: aspectRatio,
          },
        ]}>
        <Video
          source={{
            uri: mediaList[0].uri, // 영상은 1개만 가능
          }}
          style={styles.video.style}
          paused={isVideoPaused}
          resizeMode={'contain'}
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
  }, [isVideoPaused]);

  const renderStoryField = useCallback(() => {
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
  }, []);

  const renderSubmitButton = useCallback(() => {
    return (
      <View style={styles.submitButton}>
        <BlueButton
          title={'등록하기'}
          disabled={!canGoNext}
          // onPress={onSubmit}
        />
      </View>
    );
  }, [canGoNext]);

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
      flex: 1,
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
