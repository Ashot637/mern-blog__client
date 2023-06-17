import React, { FC, useEffect, useState } from 'react';
import Post from '../components/Post/Post';
import { useParams } from 'react-router-dom';
import { Comment as CommentType, Post as PostType, STATUS } from '../models/models';
import PostSkeleton from '../components/Skeletons/PostSkeleton';
import axios from '../helpers/axios';
import Comment from '../components/Comments/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/auth/authSlice';
import CustomSkeleton from '../components/Skeletons/CustomSkeleton';
import AddComment from '../components/AddComment/AddComment';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { getComments, selectPosts } from '../store/slices/posts/postSlice';

const FullPost: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { id } = useParams();
  const [post, setPost] = useState({} as PostType);
  const [status, setStatus] = useState(STATUS.LOADING);
  const { user } = useSelector(selectAuth);
  const { comments } = useSelector(selectPosts);

  useEffect(() => {
    setStatus(STATUS.LOADING);

    axios
      .get('/posts/' + id)
      .then(({ data }) => {
        setPost(data);
        dispatch(getComments(data.comments));
        setStatus(STATUS.SUCCESS);
      })
      .catch(() => setStatus(STATUS.ERROR));
    // eslint-disable-next-line
  }, [id]);

  if (status === STATUS.ERROR) {
    return <h1 style={{ textAlign: 'center' }}>Somenthing Went Wrong!</h1>;
  }

  return (
    <>
      <div className="container">
        <div className="block fullpost">
          {status === STATUS.LOADING ? (
            <PostSkeleton />
          ) : (
            <Post
              id={post._id}
              title={post.title}
              text={post.text}
              imageUrl={post.imageUrl || ''}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              viewCount={post.viewCount}
              comments={post.comments}
              user={post.user}
              isEditable={post.user._id === user?._id}
            />
          )}
          <img src="/uploads/avatar.jpg" alt="" />
          <div className="comments" style={{ maxWidth: '700px', width: '100%' }}>
            {status === STATUS.LOADING ? (
              <CustomSkeleton height={30} width={160} />
            ) : (
              <h2>Comments ({comments?.length ?? '0'})</h2>
            )}
            <br />
            <br />
            {status === STATUS.SUCCESS && user && <AddComment />}
            {status === STATUS.LOADING
              ? [...Array(5)].map((_: undefined, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <CustomSkeleton height={80} />
                      <br />
                      <br />
                    </React.Fragment>
                  );
                })
              : comments.map((comm: CommentType) => {
                  return (
                    <Comment
                      key={comm._id}
                      id={comm._id}
                      user={comm.user}
                      text={comm.text}
                      createdAt={comm.createdAt}
                      canRemove={comm.user._id === user?._id}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FullPost;
