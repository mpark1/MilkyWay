import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cognitoUsername: undefined,
  profilePic: '',
  email: '',
  name: '',
  myPets: [],
  readyForCommunityFetch: false,
};

const User = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setCognitoUsername: (state, action) => {
      state.cognitoUsername = action.payload;
    },
    setCognitoUserToNull: (state, action) => {
      state.cognitoUsername = null;
    },
    setOwnerDetails: (state, action) => {
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
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    setUserProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
    setMyPets: (state, action) => {
      state.myPets.push(action.payload);
    },
    setMyPetsFetchComplete: (state, action) => {
      state.readyForCommunityFetch = action.payload;
    },
  },
});

export const {
  setCognitoUsername,
  setOwnerDetails,
  setCognitoUserToNull,
  signoutUser,
  setCurrentPetID,
  setUserName,
  setUserProfilePic,
  setMyPets,
  setMyPetsFetchComplete,
} = User.actions;
export default User.reducer;
