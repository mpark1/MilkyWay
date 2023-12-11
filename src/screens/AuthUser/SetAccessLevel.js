import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import {CheckBox} from '@rneui/themed';
import {Icon} from '@rneui/base';
import {scaleFontSize} from '../../assets/styles/scaling';
import BlueButton from '../../components/Buttons/BlueButton';

const SetAccessLevel = ({navigation, route}) => {
  const {name, birthday, deathDay, lastWord} = route.params;
  const [checkPrivate, setPrivate] = useState(false);
  const [checkAll, setAll] = useState(true); // defaults to all

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
            // onPress={}
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
