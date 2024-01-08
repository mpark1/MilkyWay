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
  introductionMsg: '',
  manager: false,
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
      state.profilePic = action.payload.profilePic;
      state.lastWord = action.payload.lastWord;
      state.accessLevel = action.payload.accessLevel;
      state.manager = action.payload.accessLevel;
    },
    setIsManager: (state, action) => {
      state.manager = action.payload;
    },
    setPetID: (state, action) => {
      state.id = action.payload;
    },
    setIntroduction: (state, action) => {
      state.introductionMsg = action.payload;
    },
    resetPet: state => {
      return initialState;
    },
  },
});

export const {
  setPetID,
  setIntroduction,
  setIsManager,
  setPetGeneralInfo,
  resetPet,
} = Pet.actions;
export default Pet.reducer;
