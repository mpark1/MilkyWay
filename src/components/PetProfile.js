import React from 'react';
import {View, Image, Text, Dimensions, StyleSheet} from 'react-native';
import {scaleFontSize} from '../assets/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PetProfile = ({name, birthday, deathDay}) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.nameAndStarContainer}>
        <Text style={styles.name}>{name}</Text>
        <Ionicons name={'star-outline'} color={'#000'} size={18} />
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
    fontSize: scaleFontSize(22),
    color: '#000',
    marginRight: 5,
  },
  dates: {
    fontSize: scaleFontSize(18),
    color: '#939393',
    lineHeight: scaleFontSize(24),
  },
});
