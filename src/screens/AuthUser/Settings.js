import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  cameraOption,
  imageLibraryOption,
} from '../../constants/imagePickerOptions';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {Button, Icon, Tooltip} from '@rneui/base';
import {CheckBox} from '@rneui/themed';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';

import {getCurrentDate} from '../../utils/utils';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Backdrop from '../../components/Backdrop';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Settings = () => {
  // useEffect: fetch the latest user info from the User table

  const [profilePic, setProfilePic] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpnhjZPqOwRcDXdFn5gEY49CVEb7QIiat4UA&usqp=CAU',
  );
  const [name, setName] = useState('');
  const [lastWord, setLastWord] = useState('');

  const snapPoints = useMemo(() => ['30%'], []);
  const bottomSheetModalRef = useRef(null);

  const onResponseFromCameraOrGallery = res => {
    if (res.didCancel || !res) {
      return;
    }
    const uri = res.assets[0].uri;
    console.log('uri: ', uri);
    bottomSheetModalRef.current?.close();
    setProfilePic(uri);
  };

  const onChangeName = useCallback(text => {
    const trimmedText = text.trim();
    setName(trimmedText);
  }, []);

  const onChangeLastWord = useCallback(text => {
    const trimmedText = text.trim();
    setLastWord(trimmedText);
  }, []);

  const onLaunchCamera = () => {
    launchCamera(cameraOption, onResponseFromCameraOrGallery);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imageLibraryOption, onResponseFromCameraOrGallery);
  };

  const currentDateInString = getCurrentDate();

  const [birthdayString, setBirthdayString] = useState('2012-02-03');
  const [birthday, setBirthday] = useState(new Date(birthdayString));
  const [deathDayString, setDeathDayString] = useState('2023-11-25');
  const [deathDay, setDeathDay] = useState(new Date(deathDayString));

  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);

  const [checkPrivate, setPrivate] = useState(false);
  const [checkAll, setAll] = useState(true); // defaults to all

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    if (birthdayString > deathDayString) {
      return Alert.alert('생일과 기일을 다시 한번 확인해주세요', '', [
        {
          text: '확인',
        },
      ]);
    }
  }, [birthdayString, deathDayString]);

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

  const renderProfilePic = useCallback(() => {
    return (
      <View style={styles.profilePicPlaceholder}>
        <Image
          resizeMode={'cover'}
          style={styles.profilePic}
          source={{uri: profilePic}}
        />
        <Pressable
          style={styles.changeProfilePicButton}
          onPress={() => bottomSheetModalRef.current?.present()}>
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  }, [profilePic]);

  const renderNameField = useCallback(() => {
    return (
      <View style={styles.field.container}>
        <Text style={styles.field.label}>이름</Text>
        <TextInput
          placeholder={'마루'}
          placeholderTextColor={'#000'}
          style={styles.field.placeholderLine}
          autoCorrect={false}
          blurOnSubmit={true}
          onChangeText={onChangeName}
          maxLength={15}
          clearButtonMode={'while-editing'}
        />
      </View>
    );
  }, []);

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

  const renderBirthdayField = () => {
    return (
      <View style={styles.field.container}>
        <Text style={styles.field.label}>생일</Text>
        <Pressable
          style={styles.field.placeholderLine}
          onPress={() => setIsBirthdayPickerOpen(true)}>
          <Text style={styles.dates.placeholder}>{birthdayString}</Text>
          {renderDatePicker('birthday')}
        </Pressable>
      </View>
    );
  };

  const renderDeathDayField = () => {
    return (
      <View style={styles.field.container}>
        <Text style={styles.field.label}>기일</Text>
        <Pressable
          style={styles.field.placeholderLine}
          onPress={() => setIsDeathDayPickerOpen(true)}>
          <Text style={styles.dates.placeholder}>{deathDayString}</Text>
          {renderDatePicker('deathDay')}
        </Pressable>
      </View>
    );
  };

  const renderLastWordField = useCallback(() => {
    return (
      <View style={styles.field.container}>
        <Text style={styles.lastWordField.label}>마지막 인사</Text>
        <TextInput
          style={styles.lastWordField.textInput}
          placeholder={'천사같은 마루 이제 편히 잠들길.....'}
          multiline={true}
          placeholderTextColor={'#000'}
          textAlign={'left'}
          textAlignVertical={'top'}
          blurOnSubmit={true}
          onChangeText={onChangeLastWord}
          autoCorrect={false}
          clearButtonMode={'while-editing'}
          // maxLength={}
        />
      </View>
    );
  }, []);

  const renderAccessLevelField = () => {
    return (
      <View>
        <View style={styles.accessLevelField.flexDirectionRow}>
          <Text style={styles.accessLevelField.label}>추모공간 접근 설정</Text>
          <Tooltip
            visible={isTooltipOpen}
            containerStyle={{width: '72%', height: 40}}
            backgroundColor={'#A3BDED'}
            onOpen={() => setIsTooltipOpen(true)}
            onClose={() => setIsTooltipOpen(false)}
            popover={
              <Text style={{color: '#FFF', fontWeight: '600'}}>
                {checkPrivate
                  ? '초대장을 받은 사용자만 접근 가능합니다.'
                  : '모든 사용자가 추모공간을 방문할 수 있습니다.'}
              </Text>
            }>
            <Ionicons name={'information-circle'} color={'#000'} size={24} />
          </Tooltip>
        </View>
        <View style={styles.accessLevelField.flexDirectionRow}>
          <CheckBox
            containerStyle={styles.accessLevelField.checkBox.container}
            right={true}
            center={true}
            textStyle={styles.accessLevelField.checkBox.text}
            title="초대받은 사람만"
            checkedIcon={
              <Icon
                name="checkbox-marked"
                type="material-community"
                color="black"
                size={23}
              />
            }
            uncheckedIcon={
              <Icon
                name="checkbox-blank-outline"
                type="material-community"
                color="grey"
                size={23}
              />
            }
            checked={checkPrivate}
            onPress={() => {
              setPrivate(!checkPrivate);
              setAll(!checkAll);
            }}
          />

          <CheckBox
            containerStyle={styles.accessLevelField.checkBox.container}
            right={true}
            center={true}
            textStyle={styles.accessLevelField.checkBox.text}
            title="전체공개"
            checkedIcon={
              <Icon
                name="checkbox-marked"
                type="material-community"
                color="black"
                size={23}
              />
            }
            uncheckedIcon={
              <Icon
                name="checkbox-blank-outline"
                type="material-community"
                color="grey"
                size={23}
              />
            }
            checked={checkAll}
            onPress={() => {
              setAll(!checkAll);
              setPrivate(!checkPrivate);
            }}
          />
        </View>
      </View>
    );
  };

  const renderSubmitButton = () => {
    return (
      <View style={{alignSelf: 'center'}}>
        <Button
          title={'완료'}
          titleStyle={styles.submitButton.titleStyle}
          containerStyle={styles.submitButton.containerStyle}
          buttonStyle={globalStyle.backgroundBlue}
          // onPress={onUpdatePetInDB}
        />
      </View>
    );
  };

const onCloseMemorialSpace = () => {
    Alert.alert(
      '추모공간을 삭제하시겠습니까?',
      '삭제된 추모공간은 복구가 불가능합니다.',
      [
        {text: '취소'},
        {
          text: '삭제',
          // onPress:
        },
      ],
    );
  };

  const renderCloseMemorialSpace = () => {
    return (
      <Pressable onPress={() => onCloseMemorialSpace()}>
        <Text style={styles.closeMemorialSpace}>추모공간 삭제</Text>
      </Pressable>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        {renderProfilePic()}
        {renderBottomSheetModal()}
        <View style={styles.fieldsContainer}>
          {renderNameField()}
          {renderBirthdayField()}
          {renderDeathDayField()}
          {renderLastWordField()}
          {renderAccessLevelField()}
        </View>
        {renderSubmitButton()}
        {renderCloseMemorialSpace()}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  spacer: {
    paddingVertical: Dimensions.get('window').height * 0.01,
    paddingHorizontal: Dimensions.get('window').width * 0.1,
    alignItems: 'center',
  },
  profilePicPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 130 / 2,
  },
  changeProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 5,
    backgroundColor: '#FFF',
    borderRadius: 30,
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
  fieldsContainer: {
    paddingVertical: Dimensions.get('window').height * 0.04,
    width: '100%',
  },
  field: {
    container: {
      paddingBottom: Dimensions.get('window').height * 0.04,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: scaleFontSize(20),
      color: '#000',
    },
    placeholderLine: {
      fontSize: scaleFontSize(18),
      color: '#000',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: '#939393',
      textAlign: 'center',
      flex: 1,
      paddingTop: 0,
      paddingBottom: 5,
      marginLeft: '10%',
    },
  },
  dates: {
    placeholder: {
      fontSize: scaleFontSize(18),
      color: '#000',
      textAlign: 'center',
    },
  },
  lastWordField: {
    label: {
      fontSize: scaleFontSize(20),
      color: '#000',
      marginRight: Dimensions.get('window').width * 0.04,
      alignSelf: 'center',
    },
    textInput: {
      fontSize: scaleFontSize(18),
      lineHeight: scaleFontSize(24),
      color: '#000',
      borderWidth: 1,
      borderColor: '#d9d9d9',
      borderRadius: 5,
      padding: 10,
      flex: 1,
    },
  },
  accessLevelField: {
    label: {
      fontSize: scaleFontSize(20),
      color: '#000',
      marginRight: Dimensions.get('window').width * 0.04,
    },
    flexDirectionRow: {
      flexDirection: 'row',
    },
    checkBox: {
      container: {
        marginLeft: -5,
        paddingLeft: 0,
        borderColor: '#000',
      },
      text: {
        fontSize: scaleFontSize(18),
        color: '#000',
        fontWeight: '400',
      },
    },
  },
  submitButton: {
    titleStyle: {
      fontSize: scaleFontSize(18),
      color: '#FFF',
      fontWeight: 'bold',
      paddingVertical: 3,
      paddingHorizontal: 20,
    },
    containerStyle: {
      borderRadius: 10,
    },
  },
   closeMemorialSpace: {
    fontSize: scaleFontSize(16),
    color: '#939393',
    paddingVertical: 17,
  },
});
