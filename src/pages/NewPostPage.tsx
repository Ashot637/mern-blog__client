import { FC } from 'react';
import NewPost from '../components/newPost/NewPost';

const NewPostPage: FC = () => {
  return (
    <>
      <div className="container">
        <NewPost isEditMode={false} />
      </div>
    </>
  );
};

export default NewPostPage;
