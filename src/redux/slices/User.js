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
      state.profilePic = action.payload;
    },
    setMyPets: (state, action) => {
      state.myPets.push(action.payload);
    },
    setMyPetsFetchComplete: (state, action) => {
      state.readyForCommunityFetch = action.payload;
    },
    updateUserProfilePicUrl: (state, action) => {
      state.profilePic = action.payload.profilePic;
      state.s3UrlExpiredAt = action.payload.s3UrlExpiredAt;
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
  updateUserProfilePicUrl,
} = User.actions;
export default User.reducer;
