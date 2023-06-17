import { FC } from 'react';
import NewPost from '../components/newPost/NewPost';

const EditPostPage: FC = () => {
  return (
    <div className="container">
      <NewPost isEditMode={true}/>
    </div>
  );
};

export default EditPostPage;
