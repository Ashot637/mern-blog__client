import { FC, FormEvent, useState } from 'react';
import axios from '../../helpers/axios';
import './addComment.scss';
import { useParams } from 'react-router-dom';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../store/slices/posts/postSlice';
import { selectAuth } from '../../store/slices/auth/authSlice';
import { Comment } from '../../models/models';

const AddComment: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [text, setText] = useState('');
  const { id } = useParams();
  const { user } = useSelector(selectAuth);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post('posts/' + id + '/comment', { text })
      .then(({ data }: { data: Comment }) => {
        console.log(data);
        dispatch(addComment(data));
        setText('');
      })
      .catch((err) => {
        alert('failed to add a Comment');
      });
  };

  return (
    <form className="add-comment" onSubmit={(e) => onSubmit(e)}>
      <div className="add-comment__top">
        <div className="user__avatar">
          <img
            src={
              user?.avatarUrl
                ? 'https://mern-blog-api-q3ex.onrender.com' + user.avatarUrl
                : 'https://mern-blog-api-q3ex.onrender.com/uploads/avatar.jpg'
            }
            alt=""
          />
        </div>
        <input
          type="text"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button type="submit" className="btn" disabled={!text.trim()}>
        Add
      </button>
    </form>
  );
};

export default AddComment;
