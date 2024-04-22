import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../utils/api';

export const getAllUser = createAsyncThunk('user/getAllUser', async () => {
  try {
    const res = await api.get('/user');
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const addUser = createAsyncThunk('user/addUser', async (data) => {
  try {
    const res = await api.post('/user', data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id) => {
  try {
    const res = await api.delete(`/user/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }) => {
    try {
      const res = await api.patch(`/user/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
