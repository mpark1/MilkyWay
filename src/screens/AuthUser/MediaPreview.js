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
import AntDesign from 'react-native-vector-icons/AntDesign';

import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';

import BlueButton from '../../../components/Buttons/BlueButton';

const MediaPreview = ({navigation, route}) => {
  const {mediaType, imageList: initialImageList} = route.params;
  const [imageList, setImageList] = useState(initialImageList);
  console.log('mediaType: ', mediaType);
  console.log('imageList: ', imageList);

  const handleRemoveItem = index => {
    const updatedList = [...imageList];
    updatedList.splice(index, 1);
    setImageList(updatedList);
  };

  const renderFlatList = useCallback(() => {
    return (
      <FlatList
        scrollEnabled={false}
        numColumns={2}
        data={imageList}
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
  }, [imageList]);

  const renderStoryField = () => {
    return (
      <View>
        <Text style={[styles.label, {paddingBottom: 16}]}>스토리</Text>
        <TextInput
          style={styles.story.textInput}
          placeholder={
            '사진을 보면 떠오르는 추억이 있나요? (최대 300자)\n\n예: [이름]을 처음 봤을 때. 수건에 살포시 쌓여 있던 너에게 첫눈에 반했어.'
          }
          placeholderTextColor={'#939393'}
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
          disabled={imageList.length === 0}
          // onPress={}
        />
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        <Text style={styles.label}>
          {mediaType === 'photo' ? '사진' : '영상'}
        </Text>
        <View style={styles.flatListContainer}>
          {imageList.length > 0 ? (
            renderFlatList()
          ) : (
            <Text style={styles.noImagesOrVideo}>
              이전 화면으로 돌아가 사진이나 영상을 추가해주세요.
            </Text>
          )}
        </View>
        {renderStoryField()}
        {renderSubmitButton()}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MediaPreview;

const styles = StyleSheet.create({
  spacer: {paddingTop: 10, paddingHorizontal: 20},
  label: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#000',
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
  closeCircle: {
    position: 'absolute',
    right: -7,
    top: -7,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  noImagesOrVideo: {
    fontSize: scaleFontSize(16),
    color: '#939393',
    fontWeight: '500',
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
    marginVertical: Dimensions.get('window').height * 0.03,
  },
});
