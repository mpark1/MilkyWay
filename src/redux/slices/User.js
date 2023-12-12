import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  profilePic: '',
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
      state.profilePic = action.profilePic;
      state.email = action.email;
      state.name = action.name;
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
} = User.actions;
export default User.reducer;
