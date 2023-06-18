import { ThunkDispatch } from '@reduxjs/toolkit';
import { ChangeEvent, FC, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { fetchUserRegistration, selectAuth } from '../../store/slices/auth/authSlice';
import { STATUS } from '../../models/models';
import axios from '../../helpers/axios';
import '../../styles/forms.scss';

const RegisterForm: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { user, status } = useSelector(selectAuth);
  const [isVisible, setIsVisbile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmited, setIsSubmited] = useState(false);
  const inputImageRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data: FieldValues) => {
    setIsSubmited(true);

    if (avatarUrl) {
      data = {
        ...data,
        avatarUrl,
      };
    }

    const userdata = await dispatch(fetchUserRegistration(data));
    if (!userdata?.payload) {
      return;
    }

    if ('token' in userdata?.payload) {
      localStorage.setItem('token', userdata.payload.token);
    }
  };

  if (user) {
    return <Navigate to={'/'} />;
  }

  const onUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData();
      const file = event?.currentTarget?.files && event?.currentTarget?.files[0];
      formData.append('image', file!);
      const { data } = await axios.post('/upload', formData);
      setAvatarUrl(data.url);
    } catch {
      alert('Failed to Upload an Image');
    }
  };

  return (
    <div className="form-holder">
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <label>Register</label>
        <input
          ref={inputImageRef}
          onChange={onUploadFile}
          type="file"
          style={{ display: 'none' }}
        />
        <div className="avatar" onClick={() => inputImageRef?.current?.click()}>
          <img
            className="avatar"
            src={
              avatarUrl
                ? 'https://mern-blog-api-q3ex.onrender.com' + avatarUrl
                : 'https://mern-blog-api-q3ex.onrender.com/uploads/avatar.jpg'
            }
            alt=""
          />
          <div className="cam">
            <span className="material-symbols-outlined">photo_camera</span>
          </div>
        </div>
        <div>
          <input
            type="text"
            {...register('fullName', {
              required: 'Required!',
              minLength: { value: 3, message: 'Minimum 3 characters' },
            })}
            name="fullName"
            placeholder="Full Name"
          />
          {errors.fullName?.message && <p>{errors.fullName.message.toString()}</p>}
        </div>
        <div>
          <input
            type="email"
            {...register('email', {
              required: 'Required!',
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email',
              },
            })}
            name="email"
            placeholder="Email"
          />
          {errors.email?.message && <p>{errors.email.message.toString()}</p>}
        </div>
        <div className="password">
          <input
            type={isVisible ? 'text' : 'password'}
            {...register('password', {
              required: 'Required!',
              minLength: { value: 5, message: 'Minimum 5 characters' },
            })}
            placeholder="Password"
          />
          <div className="eye" onClick={() => setIsVisbile((isVisible) => !isVisible)}>
            {!isVisible ? (
              <span className="material-symbols-outlined">visibility</span>
            ) : (
              <span className="material-symbols-outlined">visibility_off</span>
            )}
          </div>
          {errors.password?.message && <p>{errors.password.message.toString()}</p>}
        </div>
        {status === STATUS.ERROR && isSubmited && <span>Failed to Register</span>}
        <button type="submit" className="btn" disabled={!isValid}>
          Submit
        </button>
        <p>
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
