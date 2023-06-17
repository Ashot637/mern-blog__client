import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios from '../../../helpers/axios';
import { STATUS, User } from '../../../models/models';
import { RootType } from '../../store';
import { FieldValues } from 'react-hook-form';

interface InitialStateProps {
  user: User | null;
  status: STATUS;
}

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (params: FieldValues) => {
  const { data } = await axios.post('/auth/login', params);

  return data;
});

export const fetchUserRegistration = createAsyncThunk(
  'auth/fetchUserRegistration',
  async (params: FieldValues) => {
    const { data } = await axios.post('/auth/register', params);

    return data;
  },
);

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');

  return data;
});

const initialState: InitialStateProps = {
  user: null,
  status: STATUS.WAITING,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = STATUS.WAITING;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<InitialStateProps>) => {
    builder.addCase(fetchUserData.pending, (state: InitialStateProps) => {
      state.status = STATUS.LOADING;
      state.user = null;
    });
    builder.addCase(
      fetchUserData.fulfilled,
      (state: InitialStateProps, action: PayloadAction<User>) => {
        state.status = STATUS.SUCCESS;
        state.user = action.payload;
      },
    );
    builder.addCase(fetchUserData.rejected, (state: InitialStateProps) => {
      state.status = STATUS.ERROR;
      state.user = null;
    });
    builder.addCase(fetchAuthMe.pending, (state: InitialStateProps) => {
      state.status = STATUS.LOADING;
      state.user = null;
    });
    builder.addCase(
      fetchAuthMe.fulfilled,
      (state: InitialStateProps, action: PayloadAction<User>) => {
        state.status = STATUS.SUCCESS;
        state.user = action.payload;
      },
    );
    builder.addCase(fetchAuthMe.rejected, (state: InitialStateProps) => {
      state.status = STATUS.ERROR;
      state.user = null;
    });
    builder.addCase(fetchUserRegistration.pending, (state: InitialStateProps) => {
      state.status = STATUS.LOADING;
      state.user = null;
    });
    builder.addCase(
      fetchUserRegistration.fulfilled,
      (state: InitialStateProps, action: PayloadAction<User>) => {
        state.status = STATUS.SUCCESS;
        state.user = action.payload;
      },
    );
    builder.addCase(fetchUserRegistration.rejected, (state: InitialStateProps) => {
      state.status = STATUS.ERROR;
      state.user = null;
    });
  },
});

export const selectAuth = (state: RootType) => state.auth;

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
