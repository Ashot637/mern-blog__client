import { FC, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { fetchUserData, selectAuth } from '../../store/slices/auth/authSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { STATUS } from '../../models/models';

const LoginForm: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { user, status } = useSelector(selectAuth);
  const [isVisible, setIsVisbile] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data: FieldValues) => {
    setIsSubmited(true);

    const userdata = await dispatch(fetchUserData(data));
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

  return (
    <div className="form-holder">
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <label>Login</label>
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
        {status === STATUS.ERROR && isSubmited && <span>Invalid login or password</span>}
        <button type="submit" className="btn" disabled={!isValid}>
          Submit
        </button>
        <p>
          Dont have an account? <Link to="/auth/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
