import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../utils/api';

export const getAllPermission = createAsyncThunk(
  'admin/getAllPermission',
  async () => {
    try {
      const res = await api.get('/permission');
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const addPermission = createAsyncThunk(
  'admin/addPermission',
  async (data) => {
    try {
      const res = await api.post('/permission', data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deletePermission = createAsyncThunk(
  'admin/deletePermission',
  async (id) => {
    try {
      const res = await api.delete(`/permission/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updatePermission = createAsyncThunk(
  'admin/updatePermission',
  async ({ id, data }) => {
    try {
      const res = await api.patch(`/permission/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getAllRole = createAsyncThunk('admin/getAllRole', async () => {
  try {
    const res = await api.get('/role');
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const addRole = createAsyncThunk('admin/addRole', async (data) => {
  try {
    const res = await api.post('/role', data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const deleteRole = createAsyncThunk('admin/deleteRole', async (id) => {
  try {
    const res = await api.delete(`/role/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateRole = createAsyncThunk(
  'admin/updateRole',
  async ({ id, data }) => {
    try {
      const res = await api.patch(`/role/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const getAllAdmin = createAsyncThunk('admin/getAllAdmin', async () => {
  try {
    const res = await api.get('/admin');
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const addAdmin = createAsyncThunk('admin/addAdmin', async (data) => {
  try {
    const res = await api.post('/admin', data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const deleteAdmin = createAsyncThunk('admin/deleteAdmin', async (id) => {
  try {
    const res = await api.delete(`/admin/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ id, data }) => {
    try {
      const res = await api.patch(`/admin/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
