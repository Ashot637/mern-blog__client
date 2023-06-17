import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/posts/postSlice';
import { authReducer } from './slices/auth/authSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
});

export type RootType = ReturnType<typeof store.getState>;

export default store;
