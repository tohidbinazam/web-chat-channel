import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getSingleChatAPI = createAsyncThunk(
  'chat/getSingleChatAPI',
  async ({ slug, limit }) => {
    try {
      const res = await api.get(`/channel/chat/${slug}/${limit}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const sendMessageAPI = createAsyncThunk(
  'chat/sendMessageAPI',
  async (data) => {
    try {
      const { slug } = data;
      const res = await api.patch(`/channel/chat/${slug}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const addChat = createAsyncThunk('chat/addChat', async (data) => {
  try {
    const res = await api.post('/chat', data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const deleteChat = createAsyncThunk('chat/deleteChat', async (id) => {
  try {
    const res = await api.delete(`/chat/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateChat = createAsyncThunk(
  'chat/updateChat',
  async ({ id, data }) => {
    try {
      const res = await api.patch(`/chat/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
