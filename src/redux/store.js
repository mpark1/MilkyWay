import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/User';
import newPetReducer from './slices/NewPet';
import petReducer from './slices/Pet';

const store = configureStore({
  reducer: {
    user: userReducer,
    newPet: newPetReducer,
    pet: petReducer,
  },
});

export default store;
