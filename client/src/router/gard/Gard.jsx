import { useSelector } from 'react-redux';
import PrivateRouter from '../PrivateRouter';
import PublicRouter from '../PublicRouter';
import { selectAuth } from '../../features/auth/authSlice';

const Gard = () => {
  const { isLoggedIn } = useSelector(selectAuth);
  return isLoggedIn ? <PrivateRouter /> : <PublicRouter />;
};

export default Gard;
