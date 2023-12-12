import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  birthday: '',
  deathDay: '',
  petType: '',
  profilePic: '',
  deathCause: '',
  lastWord: '',
  accessLevel: true, // true for public and false for private
};

const NewPet = createSlice({
  name: 'newPet',
  initialState: initialState,
  reducers: {
    setNewPetGeneralInfo: (state, action) => {
      state.name = action.payload.name;
      state.birthday = action.payload.birthday;
      state.deathDay = action.payload.deathDay;
      state.petType = action.payload.petType;
      state.profilePic = action.payload.profilePic;
      state.deathCause = action.payload.deathCause;
      state.lastWord = action.payload.lastWord;
    },
    setNewPetAccessLevel: (state, action) => {
      state.accessLevel = action.payload.accessLevel;
    },
    resetPet: state => {
      return initialState;
    },
  },
});

export const {setNewPetAccessLevel, setNewPetGeneralInfo, resetPet} =
  NewPet.actions;
export default NewPet.reducer;
