import { Comment, User } from '../../models/models';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import './post.scss';
import { getTime } from '../../helpers/getTime';
import { fetchPostDelete } from '../../store/slices/posts/postSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IPostProps {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  comments: Comment[];
  user: User;
  isEditable: boolean;
}

const Post: FC<IPostProps> = ({
  id,
  title,
  text,
  imageUrl,
  createdAt,
  viewCount,
  comments,
  user,
  isEditable,
}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const onDeletePost = () => {
    dispatch(fetchPostDelete(id));
  };

  return (
    <Link to={'/post/' + id} className="post">
      <div className="post__header">
        <div className="user">
          <div>
            <img
              src={
                user.avatarUrl
                  ? 'https://mern-blog-api-q3ex.onrender.com' + user.avatarUrl
                  : 'https://mern-blog-api-q3ex.onrender.com/uploads/avatar.jpg'
              }
              alt="avatar"
              className="user__avatar"
            />
          </div>
          <div className="user__right">
            <div className="user__name">{user.fullName}</div>
            <div className="created-at">{getTime(createdAt)}</div>
          </div>
        </div>
        {isEditable && (
          <ul className="post__header__btns">
            <Link to={'/post/' + id + '/edit'}>
              <span className="material-symbols-outlined edit">edit</span>
            </Link>
            <Link to={'/'} onClick={onDeletePost}>
              <span className="material-symbols-outlined close">close</span>
            </Link>
          </ul>
        )}
      </div>
      <div className="post__title">
        <b>{title}</b>
      </div>
      <div className="post__text">{text}</div>
      {imageUrl && (
        <div className="post__image">
          <img src={'https://mern-blog-api-q3ex.onrender.com' + imageUrl} alt="" />
        </div>
      )}
      <div className="post__footer">
        <div className="views">
          <span className="material-symbols-outlined">visibility</span>
          {viewCount}
        </div>
        <div className="comms">
          <span className="material-symbols-outlined">mode_comment</span>
          {comments?.length}
        </div>
      </div>
    </Link>
  );
};

export default Post;
