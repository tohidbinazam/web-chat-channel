import { createSlice } from '@reduxjs/toolkit';
import {
  changePass,
  checkPass,
  forgotPassword,
  loginAdmin,
  me,
  registerAdmin,
  resetPassword,
  updateProfile,
  userLogout,
} from './authApiSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: false,
    admin: null,
    permissions: null,
    new_Pass: false,
    message: null,
    error: null,
    loading: false,
  },
  reducers: {
    clearMsg: (state) => {
      state.message = null;
      state.error = null;
    },
    logout: (state) => {
      state.token = false;
      state.admin = null;
      state.permissions = null;
    },
    addToken: (state) => {
      state.token = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = true;
        state.admin = payload.admin;
        state.permissions = payload.admin.role.permissions;
        state.message = payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.message = action.payload.message;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(checkPass.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkPass.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.new_Pass = payload.new_Pass;
      })
      .addCase(checkPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(changePass.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePass.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.new_Pass = false;
        state.message = payload.message;
      })
      .addCase(changePass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.admin = payload.admin;
        state.message = payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = true;
        state.admin = payload.admin;
        state.permissions = payload.admin.role.permissions;
        state.message = payload.message;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(me.pending, (state) => {
        state.loading = true;
      })
      .addCase(me.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.admin = payload;
        state.permissions = payload.role.permissions;
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = false;
        state.token = false;
        state.error = action.error.message;
      })
      .addCase(userLogout.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = false;
        state.admin = null;
        state.permissions = null;
        state.message = payload.message;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.token = false;
        state.error = action.error.message;
      });
  },
});

export const selectAuth = (state) => state.auth;

export const { clearMsg, logout, addToken } = authSlice.actions;

export default authSlice.reducer;
