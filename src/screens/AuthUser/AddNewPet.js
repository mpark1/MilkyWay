import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {scaleFontSize} from '../../assets/styles/scaling';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Backdrop from '../../components/Backdrop';
import {
  cameraOption,
  imageLibraryOption,
} from '../../constants/imagePickerOptions';
import CustomDatePicker from '../../components/CustomDatePicker';

const AddNewPet = () => {
  const [profilePic, setProfilePic] = useState('');
  const snapPoints = useMemo(() => ['53%'], []);
  const bottomSheetModalRef = useRef(null);

  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);
  const [birthdayString, setBirthdayString] = useState('YYYY-MM-DD');
  const [birthday, setBirthday] = useState(new Date(birthdayString));
  const [deathDayString, setDeathDayString] = useState('YYYY-MM-DD');
  const [deathDay, setDeathDay] = useState(new Date(deathDayString));

  const onResponseFromCameraOrGallery = res => {
    if (res.didCancel || !res) {
      return;
    }
    const uri = res.assets[0].uri;
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
          <AntDesign name={'pluscircle'} size={35} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  };
  const renderDatePicker = option => {
    return (
      <CustomDatePicker
        option={option}
        birthday={birthday}
        setBirthday={setBirthday}
        setBirthdayString={setBirthdayString}
        isBirthdayPickerOpen={isBirthdayPickerOpen}
        setIsBirthdayPickerOpen={setIsBirthdayPickerOpen}
        deathDay={deathDay}
        setDeathDay={setDeathDay}
        setDeathDayString={setDeathDayString}
        isDeathDayPickerOpen={isDeathDayPickerOpen}
        setIsDeathDayPickerOpen={setIsDeathDayPickerOpen}
      />
    );
  };

  const renderNameField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.04}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름*</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'이름을 입력해주세요'}
            placeholderTextColor={'#939393'}
          />
        </View>
      </View>
    );
  };

  const renderBirthdayField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.04}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>생일*</Text>
          <Pressable
            style={styles.textInput}
            onPress={() => setIsBirthdayPickerOpen(true)}>
            <Text style={styles.datePlaceholder}>{birthdayString}</Text>
            {renderDatePicker('birthday')}
          </Pressable>
        </View>
      </View>
    );
  };

  const renderDeathDayField = () => {
    return (
      <View style={{marginBottom: Dimensions.get('window').height * 0.03}}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>기일*</Text>
          <Pressable
            style={styles.textInput}
            onPress={() => setIsDeathDayPickerOpen(true)}>
            <Text style={styles.datePlaceholder}>{deathDayString}</Text>
            {renderDatePicker('birthday')}
          </Pressable>
        </View>
      </View>
    );
  };

  const renderLastWordField = () => {
    return (
      <View>
        <Text style={styles.label}>멀리 떠나는 아이에게 전하는 인사말</Text>
        <TextInput
          placeholder={
            '예: 천사같은 마루 이제 편히 잠들기를.... (최대 30자 이내)'
          }
          placeholderTextColor={'#d9d9d9'}
        />
      </View>
    );
  };

  return (
    <View
      style={[globalStyle.flex, globalStyle.backgroundWhite, {padding: 20}]}>
      {renderProfilePicField()}
      <View style={styles.inputFieldsContainer}>
        {renderNameField()}
        {renderBirthdayField()}
        {renderDeathDayField()}
        {renderLastWordField()}
      </View>
      {renderBottomSheetModal()}
    </View>
  );
};

export default AddNewPet;

const styles = StyleSheet.create({
  profilePicAndButtonWrapper: {
    width: 160,
    height: 160,
    alignSelf: 'center',
  },
  profilePicPlaceholder: {
    width: 152,
    height: 152,
    borderRadius: 152 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  profilePic: {width: '100%', height: '100%', borderRadius: 115 / 2},
  addProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  inputFieldsContainer: {
    width: '95%',
    marginVertical: 20,
    alignSelf: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 30,
    color: '#000',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: scaleFontSize(16),
    textAlign: 'center',
  },
  datePlaceholder: {
    fontSize: scaleFontSize(16),
    color: '#939393',
    textAlign: 'center',
  },
  lastWord: {
    textInput: {},
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
});
