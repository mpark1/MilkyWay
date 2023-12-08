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
import DatePicker from 'react-native-date-picker';
import {getCurrentDate} from '../../utils/utils';
import DropDownPicker from 'react-native-dropdown-picker';
import PetTypes from '../../data/PetTypes.json';
import deathCauses from '../../data/deathCauses.json';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BlueButton from '../../components/Buttons/BlueButton';

const AddNewPet = () => {
  const [profilePic, setProfilePic] = useState('');
  const snapPoints = useMemo(() => ['30%'], []);
  const bottomSheetModalRef = useRef(null);
  const [value, setValue] = useState(null);
  const petOptions = Object.keys(PetTypes).map(key => ({
    label: key,
    value: key,
  }));
  const [value2, setValue2] = useState(null);
  const deathOptions = deathCauses.map(item => ({
    label: item,
    value: item,
  }));
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const currentDateInString = getCurrentDate();
  const onChangeDate = useCallback((date, option) => {
    option === 'birthday'
      ? setIsBirthdayPickerOpen(false)
      : setIsDeathDayPickerOpen(false);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    const localDateString = localDate.toISOString().split('T')[0];

    option === 'birthday' ? setBirthday(localDate) : setDeathDay(localDate);
    option === 'birthday'
      ? setBirthdayString(localDateString)
      : setDeathDayString(localDateString);
  }, []);

  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);

  const [birthdayString, setBirthdayString] = useState('YYYY-MM-DD');
  const [deathDayString, setDeathDayString] = useState('YYYY-MM-DD');

  const [birthday, setBirthday] = useState(new Date(currentDateInString));
  const [deathDay, setDeathDay] = useState(new Date(currentDateInString));

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
          <View style={styles.addProfilePicButton} />
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  };
  const renderDatePicker = option => {
    return (
      <DatePicker
        locale={'ko_KR'}
        modal
        mode={'date'}
        open={
          option === 'birthday' ? isBirthdayPickerOpen : isDeathDayPickerOpen
        }
        date={option === 'birthday' ? birthday : deathDay}
        maximumDate={new Date(currentDateInString)}
        onConfirm={newDate => {
          onChangeDate(newDate, option);
        }}
        onCancel={() => {
          option === 'birthday'
            ? setIsBirthdayPickerOpen(false)
            : setIsDeathDayPickerOpen(false);
        }}
      />
    );
  };

  const renderNameField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름*</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'이름을 입력해주세요'}
            placeholderTextColor={'#939393'}
            autoCorrect={false}
          />
        </View>
      </View>
    );
  };

  const renderBirthdayField = () => {
    return (
      <View style={styles.containerForInput}>
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
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>기일*</Text>
          <Pressable
            style={styles.textInput}
            onPress={() => setIsDeathDayPickerOpen(true)}>
            <Text style={styles.datePlaceholder}>{deathDayString}</Text>
            {renderDatePicker('deathDay')}
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
          style={styles.lastWord}
          placeholder={
            '예: 천사같은 마루 이제 편히 잠들기를.... (최대 30자 이내)'
          }
          autoCorrect={false}
          placeholderTextColor={'#d9d9d9'}
        />
      </View>
    );
  };
  const renderPetTypeField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.animalType}>
          <Text style={styles.label}>동물종류*</Text>
          <DropDownPicker
            containerStyle={styles.dropDownPicker.containerStyle}
            style={styles.dropDownPicker.borderStyle}
            dropDownContainerStyle={styles.dropDownPicker.borderStyle}
            textStyle={{fontSize: scaleFontSize(18)}}
            multiple={false}
            placeholderStyle={styles.dropDownPicker.placeholder}
            items={petOptions}
            placeholder={'동물 종류를 선택해 주세요'}
            setValue={setValue}
            value={value}
            open={open}
            setOpen={setOpen}
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>
      </View>
    );
  };

  const renderDeathCausesField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.animalType}>
          <Text style={styles.label}>별이된 이유*</Text>
          <DropDownPicker
            containerStyle={styles.dropDownPicker.containerStyle}
            style={styles.dropDownPicker.borderStyle}
            dropDownContainerStyle={styles.dropDownPicker.borderStyle}
            textStyle={{fontSize: scaleFontSize(18)}}
            multiple={false}
            placeholderStyle={styles.dropDownPicker.placeholder}
            items={deathOptions}
            placeholder={'별이된 이유를 알려주세요'}
            setValue={setValue2}
            value={value2}
            open={open2}
            setOpen={setOpen2}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </View>
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
        {renderPetTypeField()}
        {renderDeathCausesField()}
        {renderLastWordField()}
        <View style={styles.blueButton}>
          <BlueButton title={'등록하기'} />
        </View>
      </View>
      {renderBottomSheetModal()}
    </View>
  );
};

export default AddNewPet;

const styles = StyleSheet.create({
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
  inputFieldsContainer: {
    width: '90%',
    marginVertical: 18,
    alignSelf: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 20,
    color: '#000',
  },
  textInput: {
    color: '#000',
    borderColor: '#939393',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 0.8,
    borderRadius: 5,
    padding: 8,
    fontSize: scaleFontSize(18),
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  datePlaceholder: {
    fontSize: scaleFontSize(18),
    color: '#939393',
    textAlign: 'center',
  },
  lastWord: {
    marginTop: 10,
    fontSize: scaleFontSize(18),
    color: '#939393',
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
  animalType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropDownPicker: {
    containerStyle: {
      width: '65%',
      maxHeight: 40,
      backgroundColor: '#fff',
    },
    borderStyle: {
      borderRadius: 5,
      borderColor: '#d9d9d9',
      minHeight: 40,
      padding: 8,
      fontSize: scaleFontSize(18),
    },
    placeholder: {color: '#939393', fontSize: scaleFontSize(16)},
  },
  blueButton: {
    marginVertical: Dimensions.get('window').height * 0.06,
    alignSelf: 'center',
  },
});
