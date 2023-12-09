import React from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import globalStyle from '../../../assets/styles/globalStyle';
import DashedBorderButton from '../../../components/Buttons/DashedBorderButton';

const Album = ({navigation}) => {
  const renderDottedBorderButton = () => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <DashedBorderButton
          title={'추억 등록하기'}
          titleColor={'gray'}
          circleSize={30}
          onPress={() => navigation.navigate('ChooseMedia')}
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
