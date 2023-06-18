import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import './newPost.scss';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/slices/auth/authSlice';
import { FieldValues, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../helpers/axios';
import { STATUS } from '../../models/models';

interface INewPostProps {
  isEditMode: boolean;
}

const NewPost: FC<INewPostProps> = ({ isEditMode }) => {
  const { user, status } = useSelector(selectAuth);
  const [imageUrl, setImageUrl] = useState('');
  const inputImageRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    if (id) {
      axios
        .get('/posts/' + id)
        .then(({ data }) => {
          reset((formValues) => ({
            title: data.title,
            text: data.text,
          }));
          setImageUrl(data.imageUrl);
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }, [id, reset]);

  const onSubmit = async (data: FieldValues) => {
    data = {
      ...data,
      imageUrl,
    };

    const { data: postData } = isEditMode
      ? await axios.patch('posts/' + id, data)
      : await axios.post('posts', data);

    const postId = isEditMode ? id : postData._id;
    reset();
    setImageUrl('');
    navigate('/post/' + postId);
  };

  const onUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData();
      const file = event?.currentTarget?.files && event?.currentTarget?.files[0];
      formData.append('image', file!);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch {
      alert('Failed to Upload an Image');
    }
  };

  if (!user && status !== STATUS.WAITING && status !== STATUS.LOADING) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="container">
      <div className="new">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            ref={inputImageRef}
            onChange={onUploadFile}
            type="file"
            style={{ display: 'none' }}
          />
          <div className="btns">
            <button
              type="button"
              className="btn upload"
              onClick={() => inputImageRef?.current?.click()}>
              Upload Image
            </button>
            {imageUrl && (
              <button type="button" className="btn delete" onClick={() => setImageUrl('')}>
                Delete Image
              </button>
            )}
          </div>
          {imageUrl && <img src={'https://mern-blog-api-q3ex.onrender.com' + imageUrl} alt="" />}
          <div className="input-holder">
            <label>Title</label>
            <input
              type="text"
              {...register('title', {
                required: 'Required!',
                minLength: { value: 3, message: 'Minimum 3 characters' },
              })}
            />
            {errors.title?.message && <p>{errors.title.message.toString()}</p>}
          </div>
          <div className="input-holder">
            <label>Text</label>
            <textarea
              cols={30}
              rows={5}
              {...register('text', {
                required: 'Required!',
                minLength: { value: 3, message: 'Minimum 3 characters' },
              })}
            />
            {errors.text?.message && <p>{errors.text.message.toString()}</p>}
          </div>
          <button type="submit" className="btn upload" disabled={!isValid}>
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
