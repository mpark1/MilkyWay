import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  birthday: '',
  deathday: '',
  petType: '',
  profilePic: '',
  deathCause: '',
  lastWord: '',
  accessLevel: '', // 'Public' or 'Private'
  introductionMsg: null,
  manager: false,
  profilePicS3Key: '',
  s3UrlExpiredAt: '',
  identityId: '',
  backgroundPic: '',
  backgroundPicS3Key: '',
  backgroundPicS3UrlExpiredAt: '',
  breed: '',
  ownerSinceBirth: -1,
  ownershipPeriodInMonths: -1,
  careTakerType: -1,
};

const Pet = createSlice({
  name: 'pet',
  initialState: initialState,
  reducers: {
    setPetGeneralInfo: (state, action) => {
      console.log('check setPetGeneralInfo payload: ', action.payload);
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.birthday = action.payload.birthday;
      state.deathday = action.payload.deathday;
      state.petType = action.payload.petType;
      state.profilePic = action.payload.profilePic;
      state.deathCause = action.payload.deathCause;
      state.lastWord = action.payload.lastWord;
      state.accessLevel = action.payload.accessLevel;
      state.introductionMsg = action.payload.introductionMsg;
      state.manager = action.payload.manager;
      state.profilePicS3Key = action.payload.profilePicS3Key;
      state.s3UrlExpiredAt = action.payload.s3UrlExpiredAt;
      // state.backgroundPic = action.payload.backgroundPic;
      // state.backgroundPicS3Key = action.payload;
      // state.backgroundPicS3UrlExpiredAt =
      //   action.payload.backgroundPicS3UrlExpiredAt;
      state.identityId = action.payload.identityId;
      state.breed = action.payload.breed;
      state.ownerSinceBirth = action.payload.ownerSinceBirth;
      state.ownershipPeriodInMonths = action.payload.ownershipPeriodInMonths;
      state.careTakerType = action.payload.careTakerType;
    },
    setIsManager: (state, action) => {
      state.manager = action.payload;
    },
    setPetID: (state, action) => {
      state.id = action.payload;
    },
    setUpdateProfilePicUrl: (state, action) => {
      state.profilePic = action.payload.profilePic;
      state.s3UrlExpiredAt = action.payload.s3UrlExpiredAt;
    },
    setIntroduction: (state, action) => {
      state.introductionMsg = action.payload;
    },
    resetPet: (state, action) => {
      return initialState;
    },
    setNewBackgroundPicUrl: (state, action) => {
      state.backgroundPic = action.payload.backgroundPic;
      state.backgroundPicS3UrlExpiredAt =
        action.payload.backgroundPicS3UrlExpiredAt;
    },
    setNewBackgroundPicS3Key: (state, action) => {
      state.backgroundPicS3Key = action.payload;
    },
  },
});

export const {
  setPetID,
  setIntroduction,
  setIsManager,
  setPetGeneralInfo,
  resetPet,
  setUpdateProfilePicUrl,
  setNewBackgroundPicUrl,
  setNewBackgroundPicS3Key,
} = Pet.actions;
export default Pet.reducer;
