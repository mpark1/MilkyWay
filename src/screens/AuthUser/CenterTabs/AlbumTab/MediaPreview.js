import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import globalStyle from '../../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../../assets/styles/scaling';
import {Input} from '@rneui/base';

const MediaPreview = ({navigation, route}) => {
  const {imageList} = route.params;
  console.log('imageList:', imageList);

  return (
    <View style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.spacer}>
        <Text style={styles.label}>사진</Text>
        <View style={styles.flatListContainer}>
          <FlatList
            numColumns={3}
            data={imageList}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    width: Dimensions.get('window').width * 0.3,
                    height: Dimensions.get('window').width * 0.3,
                    padding: 5,
                    paddingLeft: 0,
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode={'cover'}
                    source={{uri: item.uri}}
                  />
                </View>
              );
            }}
          />
        </View>
        <Input
          label={'스토리'}
          labelStyle={styles.label}
          style={styles.textInput}
          placeholder={'사진을 보면 떠오르는 추억이 있나요? (최대 300자)'}
          placeholderTextColor={'#939393'}
          multiline={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          containerStyle={styles.textInput.containerStyle}
        />
      </View>
    </View>
  );
};

export default MediaPreview;

const styles = StyleSheet.create({
  spacer: {paddingTop: 10, paddingHorizontal: 20},
  label: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#000',
  },
  flatListContainer: {
    width: '100%',
    marginBottom: Dimensions.get('window').height * 0.03,
  },
  textInput: {
    width: '100%',
    height: Dimensions.get('window').height * 0.2,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d9d9d9',
    padding: 10,
    containerStyle: {
      margin: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
  },
});
