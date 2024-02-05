import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cognitoUsername: undefined,
  profilePic: '', // url
  email: '',
  name: '',
  myPets: [],
  readyForCommunityFetch: false,
  profilePicS3Key: '',
  s3UrlExpiredAt: '',
  isAdmin: false,
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
    signoutUser: (state, action) => {
      return initialState;
    },
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    setUserProfilePic: (state, action) => {
      state.profilePic = action.payload.profilePic;
      state.s3UrlExpiredAt = action.payload.s3UrlExpiredAt;
    },
    setUserProfilePicS3Key: (state, action) => {
      state.profilePicS3Key = action.payload.profilePicS3Key;
    },
    setMyPets: (state, action) => {
      state.myPets.push(action.payload);
    },
    setMyPetsFetchComplete: (state, action) => {
      state.readyForCommunityFetch = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

export const {
  setCognitoUsername,
  setOwnerDetails,
  setCognitoUserToNull,
  signoutUser,
  setUserName,
  setUserProfilePic,
  setUserProfilePicS3Key,
  setMyPets,
  setMyPetsFetchComplete,
  setIsAdmin,
} = User.actions;
export default User.reducer;
