import { FC, memo, useEffect, useState } from 'react';
import './header.scss';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../../store/slices/auth/authSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import { STATUS } from '../../models/models';
import UserSkeleton from '../Skeletons/UserSkeleton';
import ReactDOM from 'react-dom';

const Header: FC = memo(() => {
  const { user, status } = useSelector(selectAuth);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const onLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <nav>
            {status === STATUS.LOADING ? (
              <UserSkeleton />
            ) : !user ? (
              <ul className="header__nav">
                <li className="btn header__btn">
                  <Link to="/auth/login">Sign in</Link>
                </li>
                <li className="btn header__btn">
                  <Link to="/auth/register">Sign up</Link>
                </li>
              </ul>
            ) : (
              <ul className="user header__nav">
                <li className="btn header__btn">
                  <Link to={'/post/new'}>New Post</Link>
                </li>
                <li>
                  <ul className="user__info">
                    <li className="user__name">
                      <h3>{user.fullName}</h3>
                    </li>
                    <li>
                      <img
                        src={
                          user.avatarUrl
                            ? 'https://mern-blog-api-q3ex.onrender.com' + user.avatarUrl
                            : 'https://mern-blog-api-q3ex.onrender.com/uploads/avatar.jpg'
                        }
                        alt="avatar"
                        className="user__avatar"
                      />
                    </li>
                    <li className="user__dropdown">
                      <span
                        onClick={() => setIsOpen((isOpen) => !isOpen)}
                        style={isOpen ? { transform: 'rotateX(180deg)' } : undefined}
                        className="material-symbols-outlined">
                        arrow_drop_down
                      </span>
                      {isOpen && (
                        <div className="dropdown" onClick={onLogout}>
                          Logout
                        </div>
                      )}
                    </li>
                  </ul>
                </li>
              </ul>
            )}
          </nav>
          <HomeLink />
        </div>
      </div>
    </header>
  );
});

function HomeLink() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(':root');
    if (darkMode) {
      root?.style?.setProperty('--primary', 'white');
      root?.style?.setProperty('--white', 'black');
      root?.style?.setProperty('--bg', 'rgb(69, 69, 69)');
      root?.style?.setProperty('--text', 'white');
    } else {
      root?.style?.setProperty('--primary', '#0275d8');
      root?.style?.setProperty('--white', 'white');
      root?.style?.setProperty('--bg', 'rgb(245, 245, 245)');
      root?.style?.setProperty('--text', 'black');
    }
  }, [darkMode]);

  return ReactDOM.createPortal(
    <div className="portal">
      <label className="switch">
        <input type="checkbox" onChange={() => setDarkMode((darkMode) => !darkMode)} />
        <span className="slider round"></span>
      </label>
      <Link to={'/'} className="home">
        <span className="material-symbols-outlined">home</span>
      </Link>
    </div>,
    document.body,
  );
}

export default Header;
