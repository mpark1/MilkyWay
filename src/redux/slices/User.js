import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cognitoUsername: undefined,
};

const User = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.cognitoUsername = action.payload;
    },
  },
});

export const {setUser} = User.actions;
export default User.reducer;
