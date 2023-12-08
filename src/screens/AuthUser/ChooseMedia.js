import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import {Button} from '@rneui/base';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';
import petAge from '../../data/photoAlbumDropDown.json';

const ChooseMedia = ({navigation}) => {
  const [profilePic, setProfilePic] = useState('');
  const [selectedAge, setSelectedAge] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(petAge);

  const snapPoints = useMemo(() => ['25%'], []);
  const bottomSheetModalRef = useRef(null);

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

  const onResponse = res => {
    if (res.didCancel || !res) {
      return;
    }
    const uri = res.assets[0].uri;
    bottomSheetModalRef.current?.close();
    setProfilePic(uri);
  };

  const imageLibraryOption = {
    mediaType: 'photo',
    includeBase64: true,
    includeExtra: true,
  };

  const cameraOption = {
    mediaType: 'photo',
    includeBase64: true,
    includeExtra: true,
    savedToPhotos: true,
  };

  const onLaunchCamera = () => {
    launchCamera(cameraOption, onResponse);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imageLibraryOption, onResponse);
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
          onPress={() => onLaunchImageLibrary()}>
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

  const renderSelectMediaButton = useCallback(() => {
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
          onPress={() => bottomSheetModalRef.current?.present()}
          icon={plusButton}
        />
        <Text style={styles.dashedBorderButton.guide}>(최대 10장)</Text>
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
            {paddingBottom: 10, marginVertical: 15},
          ]}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => bottomSheetModalRef.current?.present()}
          icon={plusButton}
        />
      </View>
    );
  }, []);

  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      <View style={styles.ageField}>
        <Text style={styles.label}>연령</Text>
        <DropDownPicker
          containerStyle={styles.dropDownPicker.containerStyle}
          style={styles.dropDownPicker.borderStyle}
          dropDownContainerStyle={styles.dropDownPicker.borderStyle}
          multiple={false}
          placeholderStyle={styles.dropDownPicker.placeholder}
          placeholder={'연령을 선택해주세요'}
          setValue={setValue}
          value={value}
          items={items}
          open={open}
          setOpen={setOpen}
        />
      </View>
      <Text style={[styles.label, {marginBottom: 10}]}>사진 / 영상</Text>
      {renderSelectMediaButton()}
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
