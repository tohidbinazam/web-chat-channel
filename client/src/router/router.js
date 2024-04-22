import { createBrowserRouter } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';

const router = createBrowserRouter([...PrivateRouter, ...PublicRouter]);

export default router;
