import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import {Button} from '@rneui/base';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import ages from '../../data/ages.json';

const ChooseMedia = ({navigation}) => {
  const [mediaType, setMediaType] = useState('');
  const mediaTypeRef = useRef(mediaType);
  const [isDropDownPickerOpen, setIsDropDownPickerOpen] = useState(false);
  const ageOptions = ages.map(item => ({
    label: item,
    value: item,
  }));
  const [age, setAge] = useState(null);

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

  const onLaunchGallery = async () => {
    let mediaList = [];

    ImagePicker.openPicker({
      multiple: true,
      maxFiles: mediaTypeRef.current === 'photo' ? 8 : 1,
      mediaType: mediaTypeRef.current,
    })
      .then(async res => {
        console.log('response inside onSelectPhotosFromGallery: ', res);
        res.forEach(media => {
          // const resizedImage = await ImageResizer.createResizedImage(
          //   uri, // path
          //   300, // width
          //   300, // height
          //   'JPEG', // format
          //   100, // quality
          //   undefined, // rotation
          //   uploadFileName, // outputPath
          //   undefined, // keepMeta,
          //   undefined, // options => object
          // );

          mediaList.push({
            filename: media.filename,
            uri: media.sourceURL, // or media.path?
          });
        });
        bottomSheetModalRef.current?.close();
        navigation.navigate('MediaPreview', {
          mediaType: mediaTypeRef.current,
          mediaList: mediaList,
          age: age,
        });
      })
      .catch(e => console.log('Error: ', e.message));
  };

  const onLaunchCamera = async () => {
    // 카메라 촬영 시 사진, 영상 모두 1개만 가능함
    let singleMedia = [];
    await launchCamera({
      width: 300,
      height: 400,
      mediaType: mediaTypeRef.current,
      durationLimit: mediaTypeRef.current === 'video' ? 10 : undefined, // 초단위
      // includeBase64: true,
      // includeExtra: true,
    })
      .then(res => {
        console.log('response inside onLaunchCamera: ', res);
        singleMedia.push({uri: res.assets[0].uri});
        bottomSheetModalRef.current?.close();
        navigation.navigate('MediaPreview', {
          mediaType: mediaTypeRef.current,
          mediaList: singleMedia,
          age: age,
        });
      })
      .catch(e => console.log('Error: ', e.message));
  };

  const renderBottomSheetModalInner = () => {
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
  };

  const renderBottomSheetModal = () => {
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
  };

  const renderSelectPhotoButton = () => {
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
  };

  const renderSelectVideoButton = () => {
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
            {paddingBottom: 10, marginVertical: 15},
          ]}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => {
            setMediaType('video');
            bottomSheetModalRef.current?.present();
          }}
          icon={plusButton}
        />
      </View>
    );
  };

  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
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
          value={age}
          setValue={setAge}
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
