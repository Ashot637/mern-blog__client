import { FC, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { fetchAuthMe } from './store/slices/auth/authSlice';

import Home from './pages/Home';
import FullPost from './pages/FullPost';
import Login from './pages/Login';
import Register from './pages/Register';
import NewPostPage from './pages/NewPostPage';
import Header from './components/Header/Header';
import EditPostPage from './pages/EditPostPage';

const App: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    dispatch(fetchAuthMe());
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<FullPost />} />
        <Route path="/post/:id/edit" element={<EditPostPage />} />
        <Route path="/post/new" element={<NewPostPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
