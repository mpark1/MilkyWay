import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  birthday: '',
  deathDay: '',
  petType: '',
  profilePic: '',
  deathCause: '',
  lastWord: '',
  accessLevel: '', // 'Public', 'Private'
  complete: false,
  breed: '',
  ownerSinceBirth: -1,
  ownershipPeriodInMonths: -1,
  caretakerType: -1,
};

const NewPet = createSlice({
  name: 'newPet',
  initialState: initialState,
  reducers: {
    setNewPetGeneralInfo: (state, action) => {
      state.name = action.payload.name;
      state.birthday = action.payload.birthday;
      state.deathDay = action.payload.deathDay;
      state.profilePic = action.payload.profilePic;
      state.ownerSinceBirth = action.payload.ownerSinceBirth;
      state.ownershipPeriodInMonths = action.payload.ownershipPeriodInMonths;
      state.caretakerType = action.payload.caretakerType;
    },
    setNewPetGeneralInfo2: (state, action) => {
      state.petType = action.payload.petType;
      state.breed = action.payload.breed;
      state.deathCause = action.payload.deathCause;
      state.lastWord = action.payload.lastWord;
    },
    setNewPetAccessLevel: (state, action) => {
      state.accessLevel = action.payload.accessLevel;
    },
    setNewPetComplete: (state, action) => {
      state.complete = action.payload;
    },
    resetPet: state => {
      return initialState;
    },
  },
});

export const {
  setNewPetComplete,
  setNewPetAccessLevel,
  setNewPetGeneralInfo,
  setNewPetGeneralInfo2,
  resetPet,
} = NewPet.actions;
export default NewPet.reducer;
