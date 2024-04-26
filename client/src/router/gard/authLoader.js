import { redirect } from 'react-router-dom';

const authLoader = (permissions) => {
  if (permissions.includes('dashboard')) return null;
  return redirect('/profile');
};

export default authLoader;
