import React, {useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import {CheckBox} from '@rneui/themed';
import {Icon} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';
import BlueButton from '../../components/Buttons/BlueButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  createPet,
  createPetFamily,
  createPetPageBackgroundImage,
} from '../../graphql/mutations';
import {generateClient} from 'aws-amplify/api';
import AlertBox from '../../components/AlertBox';
import {setMyPets} from '../../redux/slices/User';
import {getIdentityID, uploadProfilePic} from '../../utils/amplifyUtil';

const SetAccessLevel = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    name,
    birthday,
    deathDay,
    profilePic,
    petType,
    deathCause,
    lastWord,
    breed,
    ownerSinceBirth,
    ownershipPeriodInMonths,
    caretakerType,
  } = useSelector(state => state.newPet);
  const userID = useSelector(state => state.user.cognitoUsername);
  const [checkPrivate, setPrivate] = useState(false);
  const [checkAll, setAll] = useState(true); // defaults to all
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  const onSubmit = async () => {
    //upload pet info in db
    await createNewPet();
    return AlertBox(
      '추모공간이 성공적으로 만들어졌습니다.',
      '',
      '내 추모공간으로 이동',
      () => {
        navigation.pop(3);
      },
    );
  };

  const createNewPet = async () => {
    const identityId = await getIdentityID();

    try {
      if (!isCallingAPI) {
        setIsCallingAPI(true);
        const client = generateClient();
        let s3key;
        // 0. save profile picture in S3
        if (profilePic.length > 0) {
          s3key = await uploadProfilePic(profilePic, 'pet');
        }
        // 1. create a new item in Pet table

        const newPetDetails = {
          name: name,
          birthday: birthday,
          deathDay: deathDay,
          profilePic:
            profilePic.length > 0 ? 'petProfile/' + s3key : profilePic, // if none selected, empty string, if picture is selected, s3key
          petType: petType,
          deathCause: deathCause,
          lastWord: lastWord,
          accessLevel: checkAll ? 'Public' : 'Private',
          managerID: userID,
          identityId: identityId,
          breed: breed,
          ownerSinceBirth: ownerSinceBirth,
          ownershipPeriodInMonths: ownershipPeriodInMonths,
          careTakerType: caretakerType,
        };
        const newPetResponse = await client.graphql({
          query: createPet,
          variables: {input: newPetDetails},
          authMode: 'userPool',
        });
        console.log(
          'print if create new pet is successful: ',
          newPetResponse.data.createPet,
        );
        const newPetID = newPetResponse.data.createPet.id;
        dispatch(setMyPets(newPetID));
        // 2. create a new item in PetFamily table
        const newPetFamilyResponse = await client.graphql({
          query: createPetFamily,
          variables: {
            input: {
              petID: newPetResponse.data.createPet.id,
              familyMemberID: userID,
            },
          },
          authMode: 'userPool',
        });
        console.log(
          'print if create new petFamily is successful: ',
          newPetFamilyResponse.data.createPetFamily,
        );
        // 3. create a new item in PetBackgroundImage table
        const newPetBackgroundImageInput = {
          petID: newPetID,
          backgroundImageKey: '',
        };
        const newPetPageBackgroundImageResponse = await client.graphql({
          query: createPetPageBackgroundImage,
          variables: {input: newPetBackgroundImageInput},
          authMode: 'userPool',
        });
      }
    } catch (error) {
      console.log('error while creating a new pet in db: ', error);
    } finally {
      setIsCallingAPI(false);
    }
  };

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        <CheckBox
          containerStyle={styles.checkBox.container}
          right={true}
          center={true}
          textStyle={styles.checkBox.text}
          title="이 공간은 관리자가 초대한 사용자만 접근할 수 있습니다."
          checkedIcon={
            <Icon
              name="radio-button-checked"
              type="material"
              color="black"
              size={23}
              iconStyle={{marginRight: 5}}
            />
          }
          uncheckedIcon={
            <Icon
              name="radio-button-unchecked"
              type="material"
              color="grey"
              size={23}
              iconStyle={{marginRight: 5}}
            />
          }
          checked={checkPrivate}
          onPress={() => {
            setPrivate(!checkPrivate);
            setAll(!checkAll);
          }}
        />

        <CheckBox
          containerStyle={styles.checkBox.container}
          right={true}
          center={true}
          textStyle={styles.checkBox.text}
          title="전체공개 - 모든 방문자들이 추모공간을 방문하여 방명록에 글을 남길 수 있습니다."
          checkedIcon={
            <Icon
              name="radio-button-checked"
              type="material"
              color="black"
              size={23}
              iconStyle={{marginRight: 5}}
            />
          }
          uncheckedIcon={
            <Icon
              name="radio-button-unchecked"
              type="material"
              color="grey"
              size={23}
              iconStyle={{marginRight: 5}}
            />
          }
          checked={checkAll}
          onPress={() => {
            setAll(!checkAll);
            setPrivate(!checkPrivate);
          }}
        />
        <Text style={styles.direction}>
          위의 권한은 관리자가 언제든 설정에 들어가 변경할 수 있습니다.
        </Text>
        <View style={styles.blueButtonContainer}>
          <BlueButton
            title={'완료'}
            disabled={isCallingAPI}
            onPress={() => onSubmit()}
          />
        </View>
      </View>
    </View>
  );
};

export default SetAccessLevel;

const styles = StyleSheet.create({
  spacer: {
    width: '90%',
    paddingTop: Dimensions.get('window').height * 0.01,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  checkBox: {
    container: {
      marginHorizontal: 0,
      paddingHorizontal: 0,
    },
    text: {
      fontSize: scaleFontSize(18),
      color: '#000',
      fontWeight: '400',
    },
  },
  direction: {
    fontSize: scaleFontSize(16),
    color: '#939393',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  blueButtonContainer: {
    paddingTop: Dimensions.get('window').height * 0.45,
    width: Dimensions.get('window').width * 0.27,
    alignSelf: 'center',
  },
});
