import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cognitoUsername: undefined,
  profilePic: '',
  email: '',
  name: '',
};

const User = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setCognitoUsername: (state, action) => {
      state.cognitoUsername = action.payload;
    },
    setCognitoUserToNull: state => {
      state.cognitoUsername = null;
    },
    setOwnerDetails: (state, action) => {
      state.profilePic = action.payload.profilePic;
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    signoutUser: state => {
      return {
        profilePic: '',
        email: '',
        name: '',
        cognitoUsername: null,
      };
    },
  },
});

export const {
  setCognitoUsername,
  setOwnerDetails,
  setCognitoUserToNull,
  signoutUser,
  setCurrentPetID,
} = User.actions;
export default User.reducer;
