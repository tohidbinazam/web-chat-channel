import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Permission from '../pages/Permission';
import Role from '../pages/Role';
import User from '../pages/User';
import PrivateGard from './gard/PrivateGard';
import Admin from '../pages/Admin';
import Profile from '../pages/Profile';
import ChannelList from '../pages/ChannelList';
import Channel from '../components/channel/Channel';
import SuperAdminGard from './gard/SuperAdminGard';

const PrivateRouter = [
  {
    element: <PrivateGard />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Dashboard />,
          },
          {
            path: '/user',
            element: <User />,
          },
          {
            element: <SuperAdminGard />,
            children: [
              {
                path: '/admin',
                element: <Admin />,
              },
              {
                path: '/role',
                element: <Role />,
              },
              {
                path: '/permission',
                element: <Permission />,
              },
            ],
          },
          {
            path: '/profile',
            element: <Profile />,
          },
          {
            path: '/channels',
            element: <ChannelList />,
          },
          {
            path: '/channel/:slug',
            element: <Channel />,
          },
        ],
      },
    ],
  },
];

export default PrivateRouter;
