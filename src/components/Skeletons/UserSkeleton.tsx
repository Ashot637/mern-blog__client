import { FC } from 'react';

const UserSkeleton: FC = () => {
  return (
    <ul className="skeleton__flex">
      <li className="skeleton__btn"></li>
      <li className="skeleton__fullName"></li>
      <li className="skeleton__avatar"></li>
      <span className="material-symbols-outlined">arrow_drop_down</span>
    </ul>
  );
};

export default UserSkeleton;
