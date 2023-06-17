import './skeleton.scss';
import { FC } from 'react';

interface ICustomSkeletonProps {
  height: number;
  width?: number;
}

const CustomSkeleton: FC<ICustomSkeletonProps> = ({ height, width }) => (
  <div className="skeleton" style={{ height, width }} />
);

export default CustomSkeleton;
