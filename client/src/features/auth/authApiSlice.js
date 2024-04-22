import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import {
  getAllPermission,
  getAllRole,
  getAllAdmin,
} from '../admin/adminApiSlice';

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
      if (res.data) {
        dispatch(getAllAdmin());
        dispatch(getAllPermission());
        dispatch(getAllRole());
        return res.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const me = createAsyncThunk('auth/me', async () => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const userLogout = createAsyncThunk('auth/userLogout', async () => {
  try {
    const res = await api.get('/auth/logout');
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

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
