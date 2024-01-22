import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import {profilePicOption} from '../constants/imagePickerOptions';
import Backdrop from './Backdrop';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {scaleFontSize} from '../assets/styles/scaling';

const SinglePictureBottomSheetModal = ({
  bottomSheetModalRef,
  setPicture,
  setPictureUrl,
  type,
}) => {
  const snapPoints = useMemo(() => ['30%'], []);

  const renderBackdrop = useCallback(
    props => <Backdrop {...props} opacity={0.2} pressBehavior={'close'} />,
    [],
  );

  const onResponseFromImagePicker = async res => {
    bottomSheetModalRef.current?.close();
    if (res.didCancel || !res) {
      return;
    }

    if (type === 'createPet') {
      await ImageResizer.createResizedImage(res.path, 300, 300, 'JPEG', 100, 0)
        .then(r => {
          setPicture(r.uri);
        })
        .catch(err => console.log(err.message));
    } else if (type === 'updateUser') {
      setPicture(res.path); // setNewProfilePicPath - replace original s3 key from redux with new profilePic's path
      setPictureUrl(res.path); // selected picture's uri - for displaying newly selected profile picture
    } else {
      setPicture(res.path);
    }
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera(profilePicOption)
      .then(onResponseFromImagePicker)
      .catch(err => console.log(err.message));
  };

  const onLaunchGallery = async () => {
    ImagePicker.openPicker(profilePicOption)
      .then(onResponseFromImagePicker)
      .catch(err => console.log('Error: ', err.message));
  };

  const renderBottomSheetModalInner = useCallback(() => {
    return (
      <>
        {type === 'updatePetPageBackground' && (
          <Text style={[styles.editBackground, {position: 'absolute'}]}>
            배경사진 변경
          </Text>
        )}
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
      </>
    );
  }, []);

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

export default SinglePictureBottomSheetModal;

const styles = StyleSheet.create({
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
  hideBottomSheetHandle: {
    height: 0,
  },
  editBackground: {
    padding: 10,
    fontSize: scaleFontSize(18),
    color: '#000',
    alignSelf: 'center',
  },
});
