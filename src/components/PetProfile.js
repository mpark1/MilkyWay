import React from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Tooltip} from '@rneui/base';

const PetProfile = ({name, birthday, deathDay}) => {
  const [isToolTipOpen, setIsToolTipOpen] = React.useState(false);
  // return (
  //   <Tooltip
  //     visible={open}
  //     onOpen={() => {
  //       setOpen(true);
  //     }}
  //     onClose={() => {
  //       setOpen(false);
  //     }}
  //     {...props}
  //   />
  // );

  return (
    <View style={styles.infoContainer}>
      <View style={styles.nameAndStarContainer}>
        <Text style={styles.name}>{name}</Text>

        <Tooltip
          visible={isToolTipOpen}
          backgroundColor={'#EEE'}
          onOpen={() => {
            setIsToolTipOpen(true);
          }}
          onClose={() => {
            setIsToolTipOpen(false);
          }}
          textStyle={{fontSize: scaleFontSize(10)}}
          containerStyle={{
            width: 250,
            height: 150,
          }}
          popover={
            <Text>
              {
                '초대받은 사람만 - 관리자에게 초대장을 받은 사용자만 접근 가능합니다.\n\n전체공개 - 은하수 앱의 모든 사용자가 접근 가능합니다.'
              }
            </Text>
          }
          withOverlay={false}
          closeOnlyOnBackdropPress={true}>
          <Ionicons name={'star-outline'} color={'#000'} size={18} />
        </Tooltip>
      </View>

      <View>
        <Text style={styles.dates}>
          생일{'     '}
          {birthday}
        </Text>
        <Text style={styles.dates}>
          기일{'     '}
          {deathDay}
        </Text>
      </View>
    </View>
  );
};

export default PetProfile;

const styles = StyleSheet.create({
  infoContainer: {
    alignSelf: 'flex-end',
  },
  nameAndStarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2%',
  },
  name: {
    fontSize: scaleFontSize(24),
    color: '#000',
    marginRight: 5,
  },
  dates: {
    fontSize: scaleFontSize(18),
    color: '#939393',
    lineHeight: scaleFontSize(24),
  },
});
