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
import Video from 'react-native-video';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import BlueButton from '../../components/Buttons/BlueButton';
import DropDownPicker from 'react-native-dropdown-picker';

import ages from '../../data/ages.json';

const MediaPreview = ({navigation, route}) => {
  const {mediaType, mediaList: initialMediaList, age} = route.params;
  const [mediaList, setMediaList] = useState(initialMediaList);
  console.log('mediaType: ', mediaType);
  console.log('imageList: ', mediaList);
  console.log('age: ', age);

  const [isDropDownPickerOpen, setIsDropDownPickerOpen] = useState(false);
  const [selectedAge, setSelectedAge] = useState(age);
  const ageOptions = ages.map(item => ({
    label: item,
    value: item,
  }));

  const handleRemoveItem = index => {
    const updatedList = [...mediaList];
    updatedList.splice(index, 1);
    setMediaList(updatedList);
  };

  const renderAgeField = () => {
    return (
      <View style={styles.ageField}>
        <Text style={styles.label}>연령</Text>
        <DropDownPicker
          containerStyle={styles.dropDownPicker.containerStyle}
          style={styles.dropDownPicker.borderStyle}
          dropDownContainerStyle={styles.dropDownPicker.borderStyle}
          multiple={false}
          placeholderStyle={styles.dropDownPicker.placeholder}
          placeholder={'연령을 선택해주세요'}
          items={ageOptions}
          value={selectedAge}
          setValue={setSelectedAge}
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
                onPress={() => handleRemoveItem(index)}>
                <AntDesign name="closecircle" size={20} color={'#6395E1'} />
              </Pressable>
            </View>
          );
        }}
      />
    );
  }, [mediaList]);

  const renderEmptyImageList = useCallback(() => {
    return (
      <View style={styles.noImagesOrVideo.container}>
        <Text style={styles.noImagesOrVideo.text}>
          {
            '선택된 사진이 없습니다.\n\n이전 화면으로 돌아가 앨범에 등록할 사진을 선택해주세요.'
          }
        </Text>
      </View>
    );
  }, []);

  const renderVideo = () => {
    return (
      <View style={styles.video.container}>
        <Video
          source={{
            uri: mediaList[0].uri, // 영상은 1개만 가능
          }}
          style={styles.video.style}
          paused={true}
          resizeMode={'cover'}
          onLoad={e => console.log(e)}
          repeat={false}
        />
      </View>
    );
  };

  const renderStoryField = () => {
    return (
      <View>
        <Text style={[styles.label, {paddingBottom: 16}]}>스토리</Text>
        <TextInput
          style={styles.story.textInput}
          placeholder={'사진을 보면 떠오르는 추억이 있나요? (최대 300자)'}
          placeholderTextColor={'#939393'}
          textAlign={'left'}
          textAlignVertical={'top'}
          multiline={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          clearButtonMode={'while-editing'}
          maxLength={300}
        />
      </View>
    );
  };

  const renderSubmitButton = () => {
    return (
      <View style={styles.submitButton}>
        <BlueButton
          title={'등록하기'}
          disabled={mediaList.length === 0}
          // onPress={}
        />
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderAgeField()}
        <Text style={styles.label}>
          {mediaType === 'photo' ? '사진' : '영상'}
        </Text>
        {mediaType === 'photo' ? (
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
    placeholder: {color: '#939393', fontSize: scaleFontSize(16)},
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
      height: Dimensions.get('window').height * 0.2,
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
