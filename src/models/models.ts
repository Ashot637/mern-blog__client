export enum STATUS {
  WAITING = 'waiting',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  text: string;
  imageUrl?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments: Comment[];
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}
