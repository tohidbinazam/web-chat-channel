import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import {
  getAllPermission,
  getAllRole,
  getAllAdmin,
} from '../admin/adminApiSlice';
import { setShow } from './authSlice';
import { resetState as authReset } from './authSlice';
import { resetState as adminReset } from '../admin/adminSlice';
import { resetState as channelReset } from '../channel/channelSlice';
import { resetState as chatReset } from '../chat/chatSlice';
import { resetState as userReset } from '../user/userSlice';
import { disconnectSocket } from '../../services/socketService';

export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (data, { dispatch }) => {
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.admin.role.slug == 'super-admin') {
        dispatch(getAllAdmin());
        dispatch(getAllPermission());
        dispatch(getAllRole());
      }
      return res.data;
    } catch (error) {
      if (error.response.status == 406) {
        dispatch(setShow(true));
      }
      throw new Error(error.response.data.message);
    }
  }
);

export const me = createAsyncThunk('auth/me', async (_, { dispatch }) => {
  try {
    const res = await api.get('/auth/me');
    if (res.data.role.slug == 'super-admin') {
      dispatch(getAllAdmin());
      dispatch(getAllPermission());
      dispatch(getAllRole());
    }
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const userLogout = createAsyncThunk(
  'auth/userLogout',
  async (_, { dispatch }) => {
    try {
      const res = await api.get('/auth/logout');
      if (res.data) {
        dispatch(resetAllState());
        disconnectSocket();
        return res.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const checkPass = createAsyncThunk(
  'auth/checkPass',
  async (data, { getState }) => {
    try {
      const id = getState().auth.admin._id;
      const res = await api.post(`/auth/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const changePass = createAsyncThunk(
  'auth/changePass',
  async (data, { getState }) => {
    try {
      const id = getState().auth.admin._id;
      const res = await api.patch(`/auth/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { getState }) => {
    try {
      const id = getState().auth.admin._id;
      const res = await api.post(`/auth/update/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data) => {
    try {
      const res = await api.post('/auth/password', data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }) => {
    try {
      const res = await api.post(`/auth/password/${token}`, { password });
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const resetAll = createAction('resetAll');

export const resetAllState = () => (dispatch) => {
  dispatch(authReset());
  dispatch(adminReset());
  dispatch(channelReset());
  dispatch(chatReset());
  dispatch(userReset());
};
