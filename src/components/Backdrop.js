import React from 'react';
import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';

const Backdrop = ({opacity, pressBehavior, ...props}) => {
  return (
    <BottomSheetBackdrop
      {...props}
      opacity={opacity}
      pressBehavior={pressBehavior}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
    />
  );
};

export default Backdrop;
