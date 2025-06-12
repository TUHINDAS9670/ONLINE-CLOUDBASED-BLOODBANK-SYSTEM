// import{configureStore} from '@reduxjs/toolkit'
// import authSlice from './features/auth/authSlice'

// const store=configureStore({
//   reducer:{
//       auth:authSlice.reducer,

//   },
//   devTools: process.env.NODE_ENV !== 'production', 
// })

// export default store
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const tokenFromStorage = localStorage.getItem("token") || null;

const preloadedState = {
  auth: {
    user: userFromStorage,
    token: tokenFromStorage,
    loading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
