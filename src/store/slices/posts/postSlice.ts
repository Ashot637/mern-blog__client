import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios from '../../../helpers/axios';
import { Comment, Post, STATUS } from '../../../models/models';
import { RootType } from '../../store';

interface InitialStateProps {
  posts: Post[];
  status: STATUS;
  comments: Comment[];
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');

  return data;
});

export const fetchPostDelete = createAsyncThunk('posts/fetchPostDelete', async (id: string) => {
  const { data } = await axios.delete('/posts/' + id);

  return data;
});

const initialState: InitialStateProps = {
  posts: [],
  status: STATUS.WAITING,
  comments: [],
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getComments: (state: InitialStateProps, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },
    addComment: (state: InitialStateProps, action: PayloadAction<Comment>) => {
      state.comments = [...state.comments, action.payload];
    },
    removeComment: (state: InitialStateProps, action: PayloadAction<string>) => {
      state.comments = state.comments.filter((comm) => comm._id !== action.payload);
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<InitialStateProps>) => {
    builder.addCase(fetchPosts.pending, (state: InitialStateProps) => {
      state.status = STATUS.LOADING;
      state.posts = [];
    });
    builder.addCase(
      fetchPosts.fulfilled,
      (state: InitialStateProps, action: PayloadAction<Post[]>) => {
        state.status = STATUS.SUCCESS;
        state.posts = action.payload;
      },
    );
    builder.addCase(fetchPosts.rejected, (state: InitialStateProps) => {
      state.status = STATUS.ERROR;
      state.posts = [];
    });
    builder.addCase(
      fetchPostDelete.fulfilled,
      (state: InitialStateProps, action: PayloadAction<Post>) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload._id);
      },
    );
  },
});

export const selectPosts = (state: RootType) => state.posts;

export const postsReducer = postSlice.reducer;

export const { getComments, addComment, removeComment } = postSlice.actions;
