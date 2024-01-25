import React, {useCallback, useEffect, useMemo} from 'react';
import {View, ScrollView, Text, Pressable, StyleSheet} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
// 방명록 안에서
// 계정 이름 클릭하면
// bottomSheet 나오는데 안에 내용은 가로 flatlist
// flatlist - 계정의 동물들 나열
// 동물 클릭하면 해당 동물의 petPage로 이동

const UserPetsBottomSheet = ({bottomSheetModalRef, userId}) => {
  const snapPoints = useMemo(() => ['50%'], []);

  useEffect(() => {
    // fetch userId's pets
  }, [userId]);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
        pressBehavior={'none'}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const renderUserPets = () => {};

  return (
    <BottomSheetModal
      handleIndicatorStyle={styles.hideBottomSheetHandle}
      handleStyle={styles.hideBottomSheetHandle}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      children={renderUserPets()}
    />
  );
};

export default UserPetsBottomSheet;

const styles = StyleSheet.create({});
