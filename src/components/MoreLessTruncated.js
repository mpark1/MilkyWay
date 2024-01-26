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
            source={{
              uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzEyMTZfNTIg/MDAxNTEzMzk4OTI1NTY5.Adb0MbO3WwvlP51KiOgKWPcPyRUYh7pbP1L5Zrp45lIg.Emli51gG8JdC7p-ooJBiYvcRvaP-sNnffoHejVLqGkYg.JPEG.samusiltour/_MG_8261.JPG?type=w800',
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
    paddingVertical: 13,
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
