import { FC } from 'react';
import './comment.scss';
import { User } from '../../models/models';
import { getTime } from '../../helpers/getTime';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { removeComment } from '../../store/slices/posts/postSlice';
import axios from '../../helpers/axios';
import { useParams } from 'react-router-dom';

interface ICommentProps {
  id: string;
  user: User;
  text: string;
  createdAt: string;
  canRemove: boolean;
}
const Comment: FC<ICommentProps> = ({ id, user, text, createdAt, canRemove }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { id: postId } = useParams();

  const onDeleteComment = () => {
    axios
      .delete(`/posts/${postId}/uncomment/${id}`)
      .then((val) => {
        dispatch(removeComment(id));
      })
      .catch((err) => {
        alert('Failed to remove a Comment');
      });
  };

  return (
    <div className="comment">
      <div className="user">
        <div>
          <img
            src={
              user?.avatarUrl
                ? 'http://localhost:7777' + user.avatarUrl
                : 'http://localhost:7777/uploads/avatar.jpg'
            }
            alt="avatar"
            className="user__avatar"
          />
        </div>
        <ul>
          <li className="user__name">
            {user.fullName} <span>{getTime(createdAt)}</span>
          </li>
          <li className="user__comm">{text}</li>
        </ul>
        {canRemove && (
          <span className="material-symbols-outlined close" onClick={onDeleteComment}>
            close
          </span>
        )}
      </div>
    </div>
  );
};

export default Comment;
