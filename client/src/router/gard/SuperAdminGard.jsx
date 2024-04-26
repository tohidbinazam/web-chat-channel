import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAuth } from '../../features/auth/authSlice';

const SuperAdminGard = () => {
  const { admin } = useSelector(selectAuth);
  return admin?.role.slug === 'super-admin' ? <Outlet /> : <Navigate to='/' />;
};

export default SuperAdminGard;
