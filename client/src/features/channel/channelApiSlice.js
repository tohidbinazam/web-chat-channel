import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../utils/api';

export const getAllChannel = createAsyncThunk(
  'channel/getAllChannel',
  async () => {
    try {
      const res = await api.get('/channel');
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getSingleChannel = createAsyncThunk(
  'channel/getSingleChannel',
  async () => {
    try {
      const res = await api.get('/channel');
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const addChannel = createAsyncThunk(
  'channel/addChannel',
  async (data) => {
    try {
      const res = await api.post('/channel', data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'channel/deleteChannel',
  async (id) => {
    try {
      const res = await api.delete(`/channel/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateChannel = createAsyncThunk(
  'channel/updateChannel',
  async ({ id, data }) => {
    try {
      const res = await api.patch(`/channel/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
