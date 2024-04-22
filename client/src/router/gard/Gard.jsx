import { useSelector } from 'react-redux';
import PrivateRouter from '../PrivateRouter';
import PublicRouter from '../PublicRouter';

const Gard = () => {
  const { token } = useSelector((state) => state.auth);
  return token ? <PrivateRouter /> : <PublicRouter />;
};

export default Gard;
