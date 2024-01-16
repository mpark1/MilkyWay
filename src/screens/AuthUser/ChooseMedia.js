import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import {Button} from '@rneui/base';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import uuid from 'react-native-uuid';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import albumCategories from '../../data/albumCategories.json';

const ChooseMedia = ({navigation}) => {
  const [mediaType, setMediaType] = useState('');
  const mediaTypeRef = useRef(mediaType);
  const [isDropDownPickerOpen, setIsDropDownPickerOpen] = useState(false);
  const categories = albumCategories.map(item => ({
    label: item,
    value: item,
  }));
  const [category, setCategory] = useState('');

  const snapPoints = useMemo(() => ['25%'], []);
  const bottomSheetModalRef = useRef(null);

  useEffect(() => {
    mediaTypeRef.current = mediaType;
  }, [mediaType]);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
        pressBehavior={'close'}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const resizePhotoAndConvertToBlob = async (photo, photoUri) => {
    console.log('photoUri: ', photoUri);
    let media = {
      filename: uuid.v4() + '.jpeg',
      contentType: 'image/jpeg',
    };
    await ImageResizer.createResizedImage(
      photoUri,
      300 / photo.width,
      300 / photo.height,
      'JPEG',
      100, // quality
    ).then(async resFromResizer => {
      console.log('resFromResizer: ', resFromResizer);
      media.uri = resFromResizer.uri;
      const resizedPhoto = await fetch(resFromResizer.uri);
      media.blob = await resizedPhoto.blob();
    });
    return media;
  };

  const onLaunchGallery = async () => {
    const isVideo = mediaTypeRef.current === 'video';
    let mediaList = [];
    await ImagePicker.openPicker({
      multiple: true,
      maxFiles: isVideo ? 1 : 8,
      mediaType: mediaTypeRef.current,
      includeExif: true,
    })
      .then(async res => {
        console.log('response inside onLaunchGallery: ', res);
        for (const media of res) {
          if (isVideo) {
            /* 영상은 하나만, max 1분 */
            if (media.duration > 60000) {
              bottomSheetModalRef.current?.close();
              Alert.alert(
                '1분 이하의 영상만 등록가능합니다.',
                '영상을 재선택해주세요.',
              );
              return;
            }
            mediaList.push({
              filename: uuid.v4() + '.mp4', // single video object
              uri: media.path,
              blob: '',
              contentType: 'video/mp4',
              widthToHeight: res.width / res.height,
              rotation: res.exif?.Orientation,
            });
          } else {
            /* 사진 1장 이상 */
            const convertedMedia = await resizePhotoAndConvertToBlob(
              media,
              media.path,
            );
            mediaList.push(convertedMedia);
          }
        }
        bottomSheetModalRef.current?.close();
        navigation.navigate('MediaPreview', {
          isPhoto: !isVideo,
          mediaList: mediaList,
          category: category,
        });
      })
      .catch(e => console.log('Error: ', e.message));
  };

  const onLaunchCamera = async () => {
    // 카메라로 촬영 하는 경우 사진, 영상 모두 1개만 가능함

    const isVideo = mediaTypeRef.current === 'video';
    console.log(isVideo);
    await launchCamera({
      mediaType: mediaTypeRef.current,
      durationLimit: 60, // 촬영 가능한 영상 길이 제한 (초단위) (길이 초과했을때 영어 Alert 뜸 - 한국어로 변경해야함)
      includeExtra: true,
      saveToPhotos: true,
    })
      .then(async resFromCamera => {
        console.log('response inside onLaunchCamera: ', resFromCamera);

        let mediaList = [];
        if (!isVideo) {
          const convertedPhotoObject = await resizePhotoAndConvertToBlob(
            resFromCamera,
            resFromCamera.assets[0].uri,
          );
          mediaList.push(convertedPhotoObject);
        } else {
          mediaList.push({
            filename: uuid.v4() + '.mp4',
            uri: resFromCamera.assets[0].uri,
            blob: '',
            contentType: 'video/mp4',
          });
        }
        bottomSheetModalRef.current?.close();
        navigation.navigate('MediaPreview', {
          isPhoto: !isVideo,
          mediaList: mediaList,
          category: category,
        });
      })
      .catch(e => console.log('Error: ', e.message));
  };

  const renderBottomSheetModalInner = useCallback(() => {
    return (
      <View style={styles.bottomSheet.inner}>
        <Pressable
          style={styles.bottomSheet.icons}
          onPress={() => onLaunchCamera()}>
          <Entypo name={'camera'} size={50} color={'#374957'} />
          <Text style={{color: '#000'}}>카메라</Text>
        </Pressable>
        <Pressable
          style={styles.bottomSheet.icons}
          onPress={() => onLaunchGallery()}>
          <FontAwesome name={'picture-o'} size={50} color={'#374957'} />
          <Text style={{color: '#000'}}>갤러리</Text>
        </Pressable>
      </View>
    );
  }, []);

  const renderBottomSheetModal = useCallback(() => {
    return (
      <BottomSheetModal
        handleIndicatorStyle={styles.hideBottomSheetHandle}
        handleStyle={styles.hideBottomSheetHandle}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        children={renderBottomSheetModalInner()}
      />
    );
  }, []);

  const renderSelectPhotoButton = useCallback(() => {
    const plusButton = (
      <View style={styles.plusButtonContainer}>
        <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
      </View>
    );
    return (
      <View>
        <Button
          title={'사진 등록하기'}
          titleStyle={{
            color: '#000',
          }}
          containerStyle={styles.dashedBorderButton.container}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => {
            setMediaType('photo');
            bottomSheetModalRef.current?.present();
          }}
          icon={plusButton}
        />
        <Text style={styles.dashedBorderButton.guide}>{' (최대 8장)'}</Text>
      </View>
    );
  }, []);

  const renderSelectVideoButton = useCallback(() => {
    const plusButton = (
      <View style={styles.plusButtonContainer}>
        <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
      </View>
    );
    return (
      <View>
        <Button
          title={'영상 등록하기'}
          titleStyle={{
            color: '#000',
          }}
          containerStyle={[
            styles.dashedBorderButton.container,
            {marginTop: 15},
          ]}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => {
            setMediaType('video');
            bottomSheetModalRef.current?.present();
          }}
          icon={plusButton}
        />
        <Text style={styles.dashedBorderButton.guide}>
          {' (최대 길이 1분)'}
        </Text>
      </View>
    );
  }, []);

  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      <View style={styles.categoryField}>
        <Text style={styles.label}>카테고리</Text>
        <DropDownPicker
          containerStyle={styles.dropDownPicker.containerStyle}
          style={styles.dropDownPicker.borderStyle}
          dropDownContainerStyle={styles.dropDownPicker.borderStyle}
          multiple={false}
          placeholderStyle={styles.dropDownPicker.placeholder}
          placeholder={'선택'}
          items={categories}
          value={category}
          setValue={setCategory}
          open={isDropDownPickerOpen}
          setOpen={setIsDropDownPickerOpen}
          listMode="SCROLLVIEW"
          autoScroll={true}
        />
      </View>
      <Text style={[styles.label, {marginBottom: 10}]}>사진 / 영상</Text>
      {renderSelectPhotoButton()}
      {renderSelectVideoButton()}
      {renderBottomSheetModal()}
    </View>
  );
};

export default ChooseMedia;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Dimensions.get('window').height * 0.03,
    zIndex: 1,
  },
  label: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    color: '#000',
    paddingVertical: 10,
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
  dashedBorderButton: {
    container: {
      width: '100%',
      paddingTop: 10,
      paddingBottom: 33,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#939393',
      alignSelf: 'center',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    guide: {
      fontSize: scaleFontSize(16),
      color: '#939393',
      position: 'absolute',
      bottom: 24,
      left: Dimensions.get('window').width * 0.2,
    },
  },
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
  bottomSheet: {
    inner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    icons: {
      width: 80,
      height: 80,
      alignItems: 'center',
    },
  },
});
