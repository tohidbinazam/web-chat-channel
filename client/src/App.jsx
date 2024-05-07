import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { me } from './features/auth/authApiSlice';
import { loginStatus } from './features/auth/authSlice';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';

function App() {
  const dispatch = useDispatch();
  const cookie = Cookies.get('token');

  if (cookie) {
    dispatch(loginStatus());
    dispatch(me());
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer theme='dark' />
    </>
  );
}

export default App;
