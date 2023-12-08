import React, {useCallback} from 'react';
import DatePicker from 'react-native-date-picker';
import {getCurrentDate} from '../utils/utils';

const CustomDatePicker = ({
  option,
  birthday,
  setBirthday,
  setBirthdayString,
  isBirthdayPickerOpen,
  setIsBirthdayPickerOpen,
  deathDay,
  setDeathDay,
  setDeathDayString,
  isDeathDayPickerOpen,
  setIsDeathDayPickerOpen,
}) => {
  const currentDateInString = getCurrentDate();

  const onChangeDate = useCallback((date, option) => {
    option === 'birthday'
      ? setIsBirthdayPickerOpen(false)
      : setIsDeathDayPickerOpen(false);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    const localDateString = localDate.toISOString().split('T')[0];

    option === 'birthday' ? setBirthday(localDate) : setDeathDay(localDate);
    option === 'birthday'
      ? setBirthdayString(localDateString)
      : setDeathDayString(localDateString);
  }, []);

  return (
    <DatePicker
      locale={'ko_KR'}
      modal
      mode="date"
      maximumDate={new Date(currentDateInString)}
      open={option === 'birthday' ? isBirthdayPickerOpen : isDeathDayPickerOpen}
      date={option === 'birthday' ? birthday : deathDay}
      onConfirm={newDate => onChangeDate(newDate, option)}
      onCancel={() => {
        option === 'birthday'
          ? setIsBirthdayPickerOpen(false)
          : setIsDeathDayPickerOpen(false);
      }}
    />
  );
};

export default CustomDatePicker;
