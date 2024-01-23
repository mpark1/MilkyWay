import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {Button, Icon, Tooltip} from '@rneui/base';
import {CheckBox} from '@rneui/themed';
import {
  deleteLetter,
  deletePetFamily,
  updatePet,
} from '../../graphql/mutations';
import {
  checkS3Url,
  mutationItem,
  mutationItemNoAlertBox,
  updateProfilePic,
} from '../../utils/amplifyUtil';
import {
  setPetGeneralInfo,
  setUpdateProfilePicUrl,
} from '../../redux/slices/Pet';

import globalStyle from '../../assets/styles/globalStyle';
import {scaleFontSize} from '../../assets/styles/scaling';
import {getCurrentDate} from '../../utils/utils';
import SinglePictureBottomSheetModal from '../../components/SinglePictureBottomSheetModal';
import AlertBox from '../../components/AlertBox';

const Settings = ({navigation, route}) => {
  const [isCallingUpdateAPI, setIsCallingUpdateAPI] = useState(false);
  const [isCallingDeleteAPI, setIsCallingDeleteAPI] = useState(false);

  const {
    id,
    name,
    profilePic,
    lastWord,
    birthday,
    deathday,
    accessLevel,
    profilePicS3Key,
    s3UrlExpiredAt,
    identityId,
  } = useSelector(state => state.pet);
  const userID = useSelector(state => state.user.cognitoUsername);
  const dispatch = useDispatch();
  const [newProfilePic, setProfilePic] = useState(profilePic);
  const [petName, setPetName] = useState(name);
  const [newLastWord, setLastWord] = useState(lastWord);

  const bottomSheetModalRef = useRef(null);

  const currentDateInString = getCurrentDate();

  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const [isDeathDayPickerOpen, setIsDeathDayPickerOpen] = useState(false);

  const [birthdayString, setBirthdayString] = useState(birthday);
  const [deathDayString, setDeathDayString] = useState(deathday);

  const [newBirthday, setBirthday] = useState(new Date(birthdayString));
  const [newDeathDay, setDeathDay] = useState(new Date(deathDayString));

  const [checkPrivate, setPrivate] = useState(accessLevel === 'Private');
  const [checkAll, setAll] = useState(accessLevel === 'Public'); // defaults to all

  const [isToolTipOpen, setIsToolTipOpen] = useState(false);

  const privateAccessMapping = {
    true: 'Private',
    false: 'Public',
  };

  const noUpdateInPetInfo =
    name === petName &&
    birthday === birthdayString &&
    deathday === deathDayString &&
    lastWord === newLastWord &&
    accessLevel === privateAccessMapping[checkPrivate];

  const noUpdateInPetProfilePic = profilePic === newProfilePic;

  useEffect(() => {
    //check user's profile picture url expiration once when the page is loaded.
    profilePic.length !== 0 && checkS3urlFunc();
  }, []);

  const checkS3urlFunc = async () => {
    const newProfileUrl = await checkS3Url(s3UrlExpiredAt, profilePicS3Key);
    if (newProfileUrl.profilePic !== null) {
      dispatch(setUpdateProfilePicUrl(newProfileUrl));
    }
  };

  const onChangeName = useCallback(text => {
    const trimmedText = text.trim();
    setPetName(trimmedText);
  }, []);

  const onChangeLastWord = useCallback(text => {
    setLastWord(text);
  }, []);

  const onChangeDate = (date, option) => {
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
  };

  const renderProfilePic = () => {
    return (
      <View style={styles.profilePicPlaceholder}>
        {newProfilePic.length !== 0 ? (
          <Image
            resizeMode={'cover'}
            style={styles.profilePic}
            source={{uri: newProfilePic}}
          />
        ) : (
          <Image
            style={styles.profilePic}
            source={require('../../assets/images/default_pet_profilePic.jpg')}
            resizeMode={'cover'}
          />
        )}
        <Pressable
          style={styles.changeProfilePicButton}
          onPress={() => bottomSheetModalRef.current?.present()}>
          <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
        </Pressable>
      </View>
    );
  };

  const renderNameField = () => {
    return (
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            value={petName}
            style={styles.textInput}
            autoCorrect={false}
            blurOnSubmit={true}
            onChangeText={onChangeName}
            maxLength={15}
            clearButtonMode={'while-editing'}
          />
        </View>
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
        date={option === 'birthday' ? newBirthday : newDeathDay}
        maximumDate={
          option === 'birthday'
            ? new Date(deathDayString)
            : new Date(currentDateInString)
        }
        minimumDate={
          option === 'deathDay'
            ? new Date(birthdayString)
            : new Date('1920-01-01')
        }
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
      <View style={styles.containerForInput}>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.label}>생일</Text>
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
          <Text style={styles.label}>기일</Text>
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
      <View style={styles.lastWordField.container}>
        <Text style={styles.label}>마지막 인사</Text>
        <TextInput
          style={styles.lastWordField.textInput}
          value={newLastWord}
          multiline={true}
          textAlign={'left'}
          textAlignVertical={'top'}
          blurOnSubmit={true}
          onChangeText={onChangeLastWord}
          autoCorrect={false}
          clearButtonMode={'while-editing'}
          maxLength={25}
        />
      </View>
    );
  };

  const renderAccessLevelField = () => {
    return (
      <View>
        <View style={styles.accessLevelField.flexDirectionRow}>
          <Text style={styles.label}>추모공간 접근 설정</Text>
          <Tooltip
            visible={isToolTipOpen}
            backgroundColor={'#EEE'}
            onOpen={() => {
              setIsToolTipOpen(true);
            }}
            onClose={() => {
              setIsToolTipOpen(false);
            }}
            containerStyle={styles.toolTipContainer}
            popover={
              <Text>
                {
                  '초대받은 사람만 - 관리자에게 초대장을 받은 사용자만 접근 가능합니다.\n\n전체공개 - 은하수 앱의 모든 사용자가 접근 가능합니다.'
                }
              </Text>
            }
            withOverlay={false}
            closeOnlyOnBackdropPress={true}>
            <Ionicons
              name={'information-circle-outline'}
              color={'#000'}
              size={24}
            />
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

  const deletePetApi = async () => {
    // delete item from PetFamily table
    await mutationItemNoAlertBox(
      isCallingUpdateAPI,
      setIsCallingUpdateAPI,
      {petID: id, familyMemberID: userID},
      deletePetFamily,
    );
    // update item in Pet table (state: ACTIVE => INACTIVE)
    await mutationItem(
      isCallingUpdateAPI,
      setIsCallingUpdateAPI,
      {id: id, state: 'INACTIVE'},
      updatePet,
      '추모공간이 삭제되었습니다.',
      navigateToPets,
    );
  };
  function navigateToPets() {
    navigation.navigate('Pets');
  }

  function popPage() {
    // update redux
    dispatch(
      setPetGeneralInfo({
        name: petName,
        birthday: birthdayString,
        deathday: deathDayString,
        profilePic: newProfilePic,
        lastWord: newLastWord,
        accessLevel: checkPrivate ? 'Private' : 'Public',
      }),
    );
    navigation.pop();
  }

  const onUpdatePetInfo = async () => {
    // 1. 사진 업데이트
    let s3key;
    if (
      // 1-1. 기존에 사진이 없다가 사진을 선택한 경우
      (profilePic.length === 0 && newProfilePic.length > 0) ||
      // 1-2. 기존에 사진이 있다가 새로운 사진으로 변경하는 경우
      (profilePic.length !== 0 && newProfilePic !== profilePic)
    ) {
      s3key = await updateProfilePic(newProfilePic, 'pet', profilePicS3Key);
    }

    // 2. Pet profilePic 을 새로운 사진의 uuid 로 업데이트
    const newPetInput = {
      id: id,
      name: petName,
      birthday: birthdayString,
      deathDay: deathDayString,
      lastWord: newLastWord,
      state: 'ACTIVE',
      accessLevel: checkPrivate ? 'Private' : 'Public',
      profilePic: s3key.length > 0 ? 'petProfile/' + s3key : profilePicS3Key,
    };

    await mutationItem(
      isCallingUpdateAPI,
      setIsCallingUpdateAPI,
      newPetInput,
      updatePet,
      '정보가 성공적으로 변경되었습니다.',
      popPage,
    );
  };

  const renderSubmitButton = () => {
    return (
      <View style={{alignSelf: 'center'}}>
        <Button
          title={'완료'}
          disabled={noUpdateInPetInfo && noUpdateInPetProfilePic}
          titleStyle={styles.submitButton.titleStyle}
          containerStyle={styles.submitButton.containerStyle}
          buttonStyle={globalStyle.backgroundBlue}
          onPress={() => onUpdatePetInfo}
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
          onPress: () => deletePetApi(),
        },
      ],
    );
  };

  const renderCloseMemorialSpace = () => {
    return (
      <Pressable
        style={styles.closeMemorialSpace}
        onPress={() => onCloseMemorialSpace()}>
        <Text style={styles.closeMemorialSpace.text}>추모공간 삭제</Text>
      </Pressable>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[globalStyle.flex, globalStyle.backgroundWhite, styles.spacer]}>
      {renderProfilePic()}
      <View style={styles.inputFieldsContainer}>
        {renderNameField()}
        {renderBirthdayField()}
        {renderDeathDayField()}
        {renderLastWordField()}
        {renderAccessLevelField()}
      </View>
      {renderSubmitButton()}
      {renderCloseMemorialSpace()}
      <SinglePictureBottomSheetModal
        type={'updatePet'}
        bottomSheetModalRef={bottomSheetModalRef}
        setPicture={setProfilePic}
        setPictureUrl={''}
      />
    </KeyboardAwareScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  spacer: {
    padding: 20,
  },
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  profilePic: {width: '100%', height: '100%', borderRadius: 120 / 2},
  changeProfilePicButton: {
    position: 'absolute',
    bottom: 10,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  label: {
    fontSize: scaleFontSize(18),
    paddingRight: 5,
    color: '#000',
  },
  inputFieldsContainer: {
    width: '90%',
    marginVertical: 18,
    alignSelf: 'center',
  },
  containerForInput: {
    marginBottom: Dimensions.get('window').height * 0.025,
    zIndex: 3000,
  },
  textInput: {
    color: '#000',
    borderColor: '#939393',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 0.8,
    padding: 6,
    fontSize: scaleFontSize(18),
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  containerForInput2: {
    marginBottom: Dimensions.get('window').height * 0.025,
    zIndex: 2000,
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
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#939393',
      minHeight: 40,
      padding: 8,
      fontSize: scaleFontSize(18),
    },
    placeholder: {color: '#000', fontSize: scaleFontSize(16)},
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePlaceholder: {
    fontSize: scaleFontSize(18),
    color: '#000',
    textAlign: 'center',
  },
  lastWordField: {
    container: {
      paddingBottom: Dimensions.get('window').height * 0.025,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textInput: {
      width: '65%',
      fontSize: scaleFontSize(18),
      lineHeight: scaleFontSize(24),
      color: '#000',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#939393',
      borderRadius: 5,
      padding: 10,
    },
  },
  accessLevelField: {
    flexDirectionRow: {
      flexDirection: 'row',
    },
    checkBox: {
      container: {
        marginLeft: -5,
        paddingLeft: 0,
        borderColor: '#000',
        marginTop: -2,
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
      fontWeight: '700',
      paddingHorizontal: 30,
    },
    containerStyle: {
      borderRadius: 10,
    },
  },
  closeMemorialSpace: {
    alignSelf: 'center',
    text: {
      fontSize: scaleFontSize(18),
      color: '#939393',
      paddingVertical: 17,
    },
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
  toolTipContainer: {
    width: '50%',
    height: Dimensions.get('window').height * 0.19,
  },
});
