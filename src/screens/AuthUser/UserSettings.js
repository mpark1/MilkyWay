import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  cameraOption,
  imageLibraryOption,
} from '../../constants/imagePickerOptions';
import {Button} from '@rneui/base';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import Backdrop from '../../components/Backdrop';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const UserSettings = ({navigation, route}) => {
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('');

  const snapPoints = useMemo(() => ['30%'], []);
  const bottomSheetModalRef = useRef(null);

  const onChangeName = useCallback(text => {
    const trimmedText = text.trim();
    setName(trimmedText);
  }, []);

  const onResponseFromCameraOrGallery = res => {
    if (res.didCancel || !res) {
      return;
    }
    const uri = res.assets.uri;
    console.log('uri: ', uri);
    bottomSheetModalRef.current?.close();
    setProfilePic(uri);
  };

  const onLaunchCamera = () => {
    launchCamera(cameraOption, onResponseFromCameraOrGallery);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imageLibraryOption, onResponseFromCameraOrGallery);
  };

  const renderProfilePicField = () => {
    return (
      <View style={styles.profilePicAndButtonWrapper}>
        {profilePic ? (
          <View style={styles.profilePicPlaceholder}>
            <Image style={styles.profilePic} source={{uri: profilePic}} />
          </View>
        ) : (
          <View style={styles.profilePicPlaceholder} />
        )}
        <Pressable
          onPress={() => bottomSheetModalRef.current?.present()}
          style={styles.addProfilePicButton}>
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  };

  const renderBackdrop = useCallback(
    props => <Backdrop {...props} opacity={0.2} pressBehavior={'close'} />,
    [],
  );

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

  const renderNameField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'회원 이름'}
            placeholderTextColor={'#000'}
            autoCorrect={false}
            blurOnSubmit={true}
            onChangeText={onChangeName}
            // maxLength={}
          />
        </View>
      </View>
    );
  };

  const renderEmailField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'email@domain.com'}
            placeholderTextColor={'#939393'}
            editable={false}
          />
        </View>
      </View>
    );
  };

  const renderSubmitButton = () => {
    return (
      <View style={styles.blueButton}>
        <Button
          title={'확인'}
          titleStyle={styles.submitButton.titleStyle}
          containerStyle={styles.submitButton.containerStyle}
          buttonStyle={globalStyle.backgroundBlue}
          // onPress={onUpdateUserInDB}
        />
      </View>
    );
  };

  const renderChangePWButton = () => {
    return (
      <Pressable
        style={styles.changePWButton.container}
        onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.changePWButton.title}>비밀번호 변경하기</Text>
      </Pressable>
    );
  };

  const renderDeleteAccountButton = () => {
    return (
      <Pressable
        style={styles.changePWButton.container}
        // onPress={}
      >
        <Text style={[styles.changePWButton.title, {color: '#939393'}]}>
          회원탈퇴
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderProfilePicField()}
        <View style={styles.fieldsContainer}>
          {renderNameField()}
          {renderEmailField()}
          {renderBottomSheetModal()}
        </View>
        {renderSubmitButton()}
        {renderChangePWButton()}
        {renderDeleteAccountButton()}
      </View>
    </View>
  );
};

export default UserSettings;

const styles = StyleSheet.create({
  spacer: {
    paddingHorizontal: 20,
    paddingVertical: Dimensions.get('window').height * 0.04,
  },
  profilePicAndButtonWrapper: {
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  containerForInput: {
    marginBottom: Dimensions.get('window').height * 0.025,
  },
  profilePicPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  profilePic: {width: '100%', height: '100%', borderRadius: 130 / 2},
  addProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  fieldsContainer: {
    width: '90%',
    marginTop: Dimensions.get('window').height * 0.05,
    marginBottom: Dimensions.get('window').height * 0.1,
    alignSelf: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 10,
    color: '#000',
  },
  textInput: {
    color: '#000',
    borderColor: '#939393',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: Dimensions.get('window').width * 0.6,
    borderRadius: 5,
    padding: 7,
    fontSize: scaleFontSize(18),
    textAlign: 'center',
    alignSelf: 'flex-end',
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
  hideBottomSheetHandle: {
    height: 0,
  },
  blueButton: {
    alignSelf: 'center',
  },
  submitButton: {
    titleStyle: {
      fontSize: scaleFontSize(16),
      color: '#FFF',
      fontWeight: '700',
      paddingVertical: 5,
      paddingHorizontal: 25,
    },
    containerStyle: {
      borderRadius: 10,
    },
  },
  changePWButton: {
    container: {
      alignSelf: 'center',
    },
    title: {
      paddingTop: Dimensions.get('window').height * 0.03,
      fontSize: scaleFontSize(18),
      color: '#6395E1',
    },
  },
});
