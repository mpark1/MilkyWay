import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ImageBackground,
} from 'react-native';

import globalStyle from '../../assets/styles/globalStyle';
import PetCard from '../../components/PetCard';
import mockData from '../../data/myMilkyWays.json';
import {pagination} from '../../utils/pagination';
import DottedBorderButton from '../../components/Buttons/DottedBorderButton';
import {scaleFontSize} from '../../assets/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Pets = ({navigation}) => {
  /* 로그인한 사용자의 모든 반려동물(Pet objects) 가져오기 */
  // useEffect(()=>{
  //   const fetchPets
  // })

  const pageSize = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [pets, setPets] = useState(mockData);
  const [renderedPets, setRenderedPets] = useState(mockData.slice(0, 3));
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  return (
    <SafeAreaView style={globalStyle.flex}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}>
        <View style={styles.settingsContainer}>
          <Ionicons name={'settings-outline'} color={'#FFF'} size={18} />
          <Text style={styles.settings}>나의 계정 관리</Text>
        </View>
        <View style={styles.flatListContainer}>
          <FlatList
            onMomentumScrollBegin={() => setIsLoadingPets(false)}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (!isLoadingPets) {
                setIsLoadingPets(true);
                setRenderedPets(prev => [
                  ...prev,
                  ...pagination(
                    mockData,
                    pageNumber + 1,
                    pageSize,
                    setPageNumber,
                  ),
                ]);
                setIsLoadingPets(false);
              }
            }}
            data={renderedPets}
            renderItem={({item}) => (
              <PetCard
                // profilePic={item.profilePic}
                name={item.name}
                birthday={item.birthday}
                deathDay={item.deathDay}
                lastWord={item.lastWord}
              />
            )}
            ListFooterComponent={() => (
              <DottedBorderButton
                type={'regular'}
                title={'새로운 추모공간 만들기'}
                circleSize={40}
                titleColor={'white'}
                onPress={() => navigation.navigate('AddNewPet')}
              />
            )}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Pets;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 10,
  },
  settings: {
    color: '#FFF',
    fontSize: scaleFontSize(14),
    marginLeft: 7,
    fontWeight: '600',
  },
  flatListContainer: {
    paddingTop: Dimensions.get('window').height * 0.02,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});
