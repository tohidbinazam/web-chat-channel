import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAuth } from '../../features/auth/authSlice';

const PublicGard = () => {
  const { isLoggedIn } = useSelector(selectAuth);
  return !isLoggedIn ? <Outlet /> : <Navigate to='/' />;
};

export default PublicGard;
