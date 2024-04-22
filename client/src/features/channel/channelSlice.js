import { createSlice } from '@reduxjs/toolkit';
import {
  addChannel,
  deleteChannel,
  getAllChannel,
  updateChannel,
} from './channelApiSlice';

const channelSlice = createSlice({
  name: 'channel',
  initialState: {
    channels: [],
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
      .addCase(getAllChannel.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllChannel.fulfilled, (state, { payload }) => {
        state.channels = payload;
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addChannel.fulfilled, (state, { payload }) => {
        state.channels.unshift(payload.channel);
        state.message = payload.message;
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteChannel.fulfilled, (state, { payload }) => {
        state.channels = state.channels.filter(
          (channel) => channel._id !== payload.channel._id
        );
        state.message = payload.message;
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateChannel.fulfilled, (state, { payload }) => {
        state.channels[
          state.channels.findIndex(
            (channel) => channel._id == payload.channel._id
          )
        ] = payload.channel;
        state.message = payload.message;
      });
  },
});

export const selectChannel = (state) => state.channel;

export const { clearMsg } = channelSlice.actions;

export default channelSlice.reducer;
