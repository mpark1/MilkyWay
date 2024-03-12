import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '마루',
  birthday: '2012-02-03',
  deathday: '2023-11-25',
  petType: '고양이',
  breed: '코리안숏헤어',
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
  ownerSinceBirth: 1,
  ownershipPeriodInMonths: 12,
  caretakerType: -1,
};

const Pet = createSlice({
  name: 'pet',
  initialState: initialState,
  reducers: {
    setPetGeneralInfo: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.birthday = action.payload.birthday;
      state.deathday = action.payload.deathday;
      state.petType = action.payload.petType;
      state.profilePic = action.payload.profilePic;
      state.lastWord = action.payload.lastWord;
      state.accessLevel = action.payload.accessLevel;
      state.manager = action.payload.accessLevel;
      state.profilePicS3Key = action.payload.profilePicS3Key;
      state.s3UrlExpiredAt = action.payload.s3UrlExpiredAt;
      state.identityId = action.payload.identityId;
      state.deathCause = action.payload.deathCause;
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
