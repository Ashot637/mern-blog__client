import { FC } from 'react';
import Post from '../Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPosts, selectPosts } from '../../store/slices/posts/postSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { Post as PostType, STATUS } from '../../models/models';
import PostSkeleton from '../Skeletons/PostSkeleton';
import { selectAuth } from '../../store/slices/auth/authSlice';

const Posts: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { posts, status } = useSelector(selectPosts);
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchPosts());
    //eslint-disable-next-line
  }, []);

  if (status === STATUS.ERROR) {
    return <h1 style={{ textAlign: 'center' }}>Somenthing Went Wrong!</h1>;
  }

  if (status === STATUS.LOADING) {
    return (
      <div className="container">
        <div className="block">
          {[...Array(5)].map((_, index) => {
            return <PostSkeleton key={index} />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="block">
        {posts.map((post: PostType) => {
          return (
            <Post
              key={post._id}
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
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
