import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import DottedBorderButton from '../../../components/Buttons/DottedBorderButton';
import globalStyle from '../../../assets/styles/globalStyle';

const Album = ({navigation}) => {
  const renderDottedBorderButton = () => {
    return (
      <DottedBorderButton
        type={'regular'}
        title={'추억 등록하기'}
        circleSize={40}
        titleColor={'black'}
        onPress={() => navigation.navigate('ChoosePhotoOrVideo')}
      />
    );
  };
  return (
    <ScrollView style={[globalStyle.flex, globalStyle.flex, {padding: 20}]}>
      {renderDottedBorderButton()}
    </ScrollView>
  );
};

export default Album;
