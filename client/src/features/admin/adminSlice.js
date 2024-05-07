import { createSlice } from '@reduxjs/toolkit';
import {
  addPermission,
  addRole,
  addAdmin,
  deletePermission,
  deleteRole,
  deleteAdmin,
  getAllPermission,
  getAllRole,
  getAllAdmin,
  updatePermission,
  updateRole,
  updateAdmin,
} from './adminApiSlice';

const initialState = {
  admins: null,
  permission: null,
  role: [],
  message: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    resetState: (_) => initialState,
    clearMsg: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllPermission.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.permission = payload;
      })
      .addCase(addPermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addPermission.fulfilled, (state, { payload }) => {
        state.permission.unshift(payload.permission);
        state.message = payload.message;
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deletePermission.fulfilled, (state, { payload }) => {
        state.permission = state.permission.filter(
          (permission) => permission._id !== payload.permission._id
        );
        state.message = payload.message;
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePermission.fulfilled, (state, { payload }) => {
        state.permission[
          state.permission.findIndex(
            (permission) => permission._id == payload.permission._id
          )
        ] = payload.permission;
        state.message = payload.message;
      })
      .addCase(getAllRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllRole.fulfilled, (state, { payload }) => {
        state.role = payload.roles;
      })
      .addCase(addRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addRole.fulfilled, (state, { payload }) => {
        state.role.unshift(payload.role);
        state.message = payload.message;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteRole.fulfilled, (state, { payload }) => {
        state.role = state.role.filter((role) => role._id !== payload.role._id);
        state.message = payload.message;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateRole.fulfilled, (state, { payload }) => {
        state.role[
          state.role.findIndex((role) => role._id == payload.role._id)
        ] = payload.role;
        state.message = payload.message;
      })
      .addCase(getAllAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllAdmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.admins = payload;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addAdmin.fulfilled, (state, { payload }) => {
        state.admins.unshift(payload.admin);
        state.message = payload.message;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteAdmin.fulfilled, (state, { payload }) => {
        state.admins = state.admins.filter(
          (admin) => admin._id !== payload.admin._id
        );
        state.message = payload.message;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateAdmin.fulfilled, (state, { payload }) => {
        state.admins[
          state.admins.findIndex((admin) => admin._id == payload.admin._id)
        ] = payload.admin;
        state.message = payload.message;
      });
  },
});

export const selectAdmin = (state) => state.admin;

export const { resetState, clearMsg } = userSlice.actions;

export default userSlice.reducer;
