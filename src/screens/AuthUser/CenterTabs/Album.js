import React from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';
import globalStyle from '../../../assets/styles/globalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '@rneui/base';

const Album = ({navigation}) => {
  const renderDottedBorderButton = () => {
    const plusButton = (
      <View style={styles.plusButtonContainer}>
        <AntDesign name={'pluscircle'} size={30} color={'#6395E1'} />
      </View>
    );
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <Button
          title={'추억 등록하기'}
          titleStyle={{
            color: '#939393',
          }}
          containerStyle={{
            width: '100%',
            height: 50,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: '#939393',
            alignSelf: 'center',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => navigation.navigate('ChooseMedia')}
          icon={plusButton}
        />
      </View>
    );
  };
  return (
    <ScrollView
      style={[
        globalStyle.flex,
        globalStyle.backgroundWhite,
        {paddingVertical: 15},
      ]}>
      {renderDottedBorderButton()}
    </ScrollView>
  );
};

export default Album;

const styles = StyleSheet.create({
  plusButtonContainer: {
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.07,
  },
});
