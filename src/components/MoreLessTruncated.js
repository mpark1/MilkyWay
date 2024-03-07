import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MoreLessComponent from './MoreLess';
import {scaleFontSize} from '../assets/styles/scaling';
import EditOrDeleteButtons from './EditOrDeleteButtons';
import DeleteIcon from './DeleteIcon';
import {isiOS} from '@amuizz/read-more-text/src/util/Platform';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomSheetOtherUserPet from './BottomSheetOtherUserPet';
import globalStyle from '../assets/styles/globalStyle';
import mockData from '../data/myMilkyWays.json';
import {useNavigation} from '@react-navigation/native';

const MoreLessTruncated = ({item, linesToTruncate, whichTab}) => {
  const navigation = useNavigation();
  const [isTruncated, setIsTruncated] = useState(false);
  const [clippedText, setClippedText] = useState('');
  const {timestamp, relationship, title} = item;
  const text = item.content.trim();

  const [clickedId, setClickedId] = useState('');
  const snapPoints = useMemo(() => ['35%'], []);
  const userPetsBottomSheetRef = useRef(null);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
        pressBehavior={'close'}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const handleTextLayout = event => {
    const {lines} = event.nativeEvent;
    if (lines.length > linesToTruncate) {
      setIsTruncated(true);
      let displayedText = lines
        .slice(0, linesToTruncate)
        .map(line => line.text)
        .join('');
      setClippedText(displayedText.substring(0, displayedText.length - 4));
    }
  };

  const renderText = () => {
    return isTruncated ? (
      <MoreLessComponent
        truncatedText={clippedText}
        fullText={text}
        item={item}
        whichTab={whichTab}
      />
    ) : (
      <Text
        style={styles.content}
        numberOfLines={2}
        onTextLayout={handleTextLayout}>
        {text}
      </Text>
    );
  };

  const fetchUserPets = async () => {};

  const renderUserPets = useCallback(() => {
    return (
      <View
        style={[
          globalStyle.flex,
          globalStyle.backgroundWhite,
          {paddingVertical: 10, paddingHorizontal: 15},
        ]}>
        <Text
          style={{
            alignSelf: 'center',
            color: '#374957',
            fontSize: scaleFontSize(18),
          }}>
          {clickedId}님의 은하수를 이루는 별
        </Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flex: 1,
            marginVertical: '3%',
          }}
          data={mockData}
          renderItem={({item}) => (
            <BottomSheetOtherUserPet
              profilePicUrl={''}
              id={item.name}
              navigation={navigation}
              userPetsBottomSheetRef={userPetsBottomSheetRef}
            />
          )}
        />
      </View>
    );
  }, [clickedId]);

  return (
    <View style={styles.letter}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.flexDirectionRow}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            // source={{
            //   uri: 'data:image/jpeg;base64,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',
            // }}
            source={{
              uri:
                item.name !== '설이별이'
                  ? 'https://images.pexels.com/photos/267149/pexels-photo-267149.jpeg'
                  : 'https://media.bunjang.co.kr/product/234850301_1_1706088713_w360.jpg',
            }}
          />
        </View>
        <View style={styles.collapsedTextContainer}>
          {isiOS && (
            <Text style={{height: 0}} onTextLayout={handleTextLayout}>
              {text}
            </Text>
          )}

          <View style={styles.nameRelationshipDateContainer}>
            <Pressable
              onPress={() => {
                userPetsBottomSheetRef.current?.present();
                setClickedId(item.name);
                fetchUserPets();
              }}>
              <Text style={styles.name}>
                {item.name}
                {'   '}
              </Text>
            </Pressable>
            <Text style={styles.relationshipAndDate}>
              {relationship} ({timestamp.substring(0, 10)})
            </Text>
          </View>
          {renderText()}
          <View style={styles.editAndDeleteContainer}>
            {whichTab === 'Letters' && !isTruncated && (
              <EditOrDeleteButtons item={item} />
            )}
            {whichTab === 'GuestBook' && !isTruncated && (
              <DeleteIcon item={item} />
            )}
          </View>
        </View>
      </View>
      <BottomSheetModal
        handleIndicatorStyle={styles.hideBottomSheetHandle}
        handleStyle={styles.hideBottomSheetHandle}
        ref={userPetsBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        children={renderUserPets}
      />
    </View>
  );
};

export default MoreLessTruncated;

const styles = StyleSheet.create({
  letter: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
  },
  title: {
    color: '#374957',
    fontSize: scaleFontSize(17),
    fontWeight: 'bold',
    paddingBottom: 7,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  profilePicContainer: {
    height: 80,
    width: 80,
    marginTop: 8,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  collapsedTextContainer: {
    flex: 1,
    paddingLeft: 5,
    marginLeft: 25,
  },
  nameRelationshipDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 7,
  },
  name: {
    fontWeight: 'bold',
    fontSize: scaleFontSize(16),
    color: '#374957',
  },
  relationshipAndDate: {
    color: '#939393',
    fontSize: scaleFontSize(16),
  },
  content: {
    color: '#374957',
    fontSize: scaleFontSize(16),
    lineHeight: scaleFontSize(24),
    paddingTop: 10,
  },
  editAndDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
});
