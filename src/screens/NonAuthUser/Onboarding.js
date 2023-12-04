import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Platform,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {scaleFontSize} from '../../assets/styles/scaling';

import globalStyle from '../../assets/styles/globalStyle';

const Onboarding = ({navigation}) => {
  return (
    <View style={[globalStyle.flex]}>
      <Image
        style={styles.backgroundImage}
        source={require('../../assets/images/milkyWayBackgroundImage.png')}
        resizeMode={'cover'}
      />
      <View style={styles.onboardingMessageContainer}>
        <Text style={styles.onboardingMessage}>
          은하수에는 지구를 포함 2천억개가 넘는 별들이 존재해요. 무지개 다리를
          건넌 천사같은 아이들은 이 은하수에 있는 별이 됩니다.{'\n'}
          {'\n'}
          은하수에 이름이 없는 수많은 별들 중 하나에 지구에 살던 본인의 이름을
          붙여 이제는 그 별로 존재해요.{'\n'}
          {'\n'}별은 존재하지만 우리의 눈에 보이지는 않아요.{'\n'}
          {'\n'}하지만 보이지 않는다고 해서 없어지는 건 아니에요.{'\n'}
          {'\n'}다만 이제는 다른 공간에 존재할 뿐.{'\n'}
          {'\n'}이제는 내 옆에 없는 나의 별을 추억하고 싶은 분들을 위한
          공간입니다.
        </Text>
      </View>
      <Pressable
        style={styles.getStartedButton}
        onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.getStarted}>시작하기</Text>
      </Pressable>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  onboardingMessageContainer: {
    position: 'absolute',
    height: Dimensions.get('window').height * 0.7,
    flexDirection: 'row',
    paddingHorizontal: Dimensions.get('window').width * 0.1,
    paddingTop: Dimensions.get('window').height * 0.1,
  },
  onboardingMessage: {
    fontWeight: '700',
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    color: '#FFF',
    flexWrap: 'wrap',
  },
  getStartedButton: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.08,
    alignSelf: 'center',
  },
  getStarted: {
    color: '#FFF',
    fontSize: scaleFontSize(36),
    fontWeight: '700',
  },
});
