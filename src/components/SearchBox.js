import React, {useState} from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '@rneui/themed';
import {scaleFontSize} from '../assets/styles/scaling';

const SearchBox = ({fetchSearchedPets, isFetchComplete}) => {
  const [petName, setPetName] = useState('');
  const canGoNext = petName.length > 0 && isFetchComplete !== 1;

  return (
    <View style={styles.searchBox}>
      <TextInput
        style={styles.textInput}
        placeholder={'동물 이름으로 찾기'}
        placeholderTextColor={'#939393'}
        autoCapitalize={'none'}
        autoCorrect={false}
        value={petName}
        onChangeText={setPetName}
      />
      <Ionicons
        style={styles.searchIcon}
        name={'search'}
        color={'#373737'}
        size={24}
      />
      <Button
        title="검색"
        type="solid"
        disabled={!canGoNext}
        titleStyle={styles.buttonTitleStyle}
        buttonStyle={styles.buttonBackgroundColor}
        containerStyle={styles.buttonContainer}
        onPress={() => {
          fetchSearchedPets(petName, true);
        }}
      />
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  textInput: {
    width: '83%',
    height: '95%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 5,
    paddingLeft: 35,
    color: '#000000',
    fontSize: scaleFontSize(18),
    fontWeight: '500',
    alignSelf: 'center',
  },
  searchBox: {
    paddingVertical: 8,
    height: Dimensions.get('window').height * 0.09,
    width: Dimensions.get('window').width * 0.93,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchIcon: {
    position: 'absolute',
    left: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    borderRadius: 7,
  },
  buttonTitleStyle: {
    color: '#FFF',
    fontSize: scaleFontSize(18),
    paddingVertical: 4,
  },
  buttonBackgroundColor: {
    backgroundColor: '#939393',
  },
});
