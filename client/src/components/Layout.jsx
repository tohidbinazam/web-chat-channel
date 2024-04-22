import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Navbar from './navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { clearMsg } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import {
  connectSocket,
  disconnectSocket,
  subscribeToReceiveMessage,
  subscribeToSetMessage,
  unsubscribeFromReceiveMessage,
  unsubscribeFromSetMessage,
} from '../services/socketService';
import { getAllRole } from '../features/admin/adminApiSlice';
import { getAllChannel } from '../features/channel/channelApiSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.auth);

  const [nav, setNav] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleNav = () => {
    setNav((prevNav) => !prevNav);
  };

  const handleExpand = () => {
    setExpand((prevExpand) => !prevExpand);
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMsg());
    }
    connectSocket();
    subscribeToReceiveMessage(dispatch);
    subscribeToSetMessage(dispatch);
    dispatch(getAllRole());
    dispatch(getAllChannel());

    return () => {
      disconnectSocket();
      unsubscribeFromReceiveMessage();
      unsubscribeFromSetMessage();
    };
  }, [message, dispatch]);

  return (
    <>
      <div className={`${nav && 'mini-sidebar'} ${expand && 'expand-menu'}`}>
        {/* pass the handleNav function in Header component*/}
        <Header handleNav={handleNav} />
        <Navbar handleExpand={handleExpand} />

        <Outlet />
      </div>
    </>
  );
};

export default Layout;
