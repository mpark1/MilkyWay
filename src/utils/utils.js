import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function getTimeElapsed(dateTimeString) {
  const inputDate = new Date(dateTimeString);
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate - inputDate;

  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 31);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years}년 전 `;
  } else if (months > 0) {
    if (months === 1) {
      return '한달 전 ';
    } else {
      return `${months}달 전 `;
    }
  } else if (days > 0) {
    if (days === 7) {
      return '1주일 전 ';
    } else {
      return `${days}일 전 `;
    }
  } else if (hours > 0) {
    return `${hours}시간 전 `;
  } else if (minutes > 0) {
    return `${minutes}분 전 `;
  } else {
    return `${seconds}초 전 `;
  }
}

export function calculateAge(selectedDate, type) {
  // Get the current date
  const currentDate = new Date();

  // Calculate the age
  let ageInYears = currentDate.getFullYear() - selectedDate.getFullYear();
  let ageInMonths =
    (currentDate.getFullYear() - selectedDate.getFullYear()) * 12 +
    (currentDate.getMonth() - selectedDate.getMonth());

  // If the birth month and day haven't occurred this year yet, subtract 1 from age
  if (
    currentDate.getMonth() < selectedDate.getMonth() ||
    (currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getDate() < selectedDate.getDate())
  ) {
    ageInYears--;
    ageInMonths--;
  }

  if (type === 'human') {
    return ageInYears;
  } else if (ageInYears < 1) {
    return ageInMonths.toString() + '개월';
  } else {
    return ageInYears.toString() + '살';
  }
}

export function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-11, hence add 1
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function removeUserProfilePicOnDevice(imagePathInFS) {
  try {
    await RNFS.unlink(imagePathInFS);
    console.log('파일 시스템에서 삭제 성공!');
    await AsyncStorage.removeItem('userProfile');
    console.log('AsyncStorage 에서 삭제 성공!');
  } catch (error) {
    console.log('Error deleting profilePic from local storage: ', error);
  }
}

export function getMonthsElapsed(dateString) {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const yearsDifference = currentDate.getFullYear() - inputDate.getFullYear();
  const monthsDifference = currentDate.getMonth() - inputDate.getMonth();
  const totalMonths = yearsDifference * 12 + monthsDifference;

  if (totalMonths <= 0) {
    // Check if at least a month has passed or if it's the same month but a different day.
    if (totalMonths === 0 && currentDate.getDate() >= inputDate.getDate()) {
      // If it's the same month and at least one day has passed, return 1.
      return 1;
    } else {
      // If no full month has passed or it's still the same day, adjust to indicate at least one month has passed.
      return 1;
    }
  } else {
    // Calculate if a partial month has passed and adjust the count.
    if (currentDate.getDate() < inputDate.getDate()) {
      // If the current day of the month is less than the input day, subtract one to adjust for the partial month.
      return Math.max(1, totalMonths - 1);
    } else {
      return Math.max(1, totalMonths);
    }
  }
}
