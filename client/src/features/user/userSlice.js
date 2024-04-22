import { createSlice } from '@reduxjs/toolkit';
import { addUser, deleteUser, getAllUser, updateUser } from './userApiSlice';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    message: null,
    error: null,
    loading: false,
  },
  reducers: {
    clearMsg: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllUser.fulfilled, (state, { payload }) => {
        state.users = payload.users;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, { payload }) => {
        state.users.unshift(payload.user);
        state.message = payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.users = state.users.filter(
          (user) => user._id !== payload.user._id
        );
        state.message = payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.users[
          state.users.findIndex((user) => user._id == payload.user._id)
        ] = payload.user;
        state.message = payload.message;
      });
  },
});

export const selectUser = (state) => state.user;

export const { clearMsg } = userSlice.actions;

export default userSlice.reducer;
