import { createSlice } from '@reduxjs/toolkit';
import {
  addChat,
  deleteChat,
  getSingleChatAPI,
  sendMessageAPI,
  updateChat,
} from './chatApiSlice';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: {},
    socket: '',
    message: null,
    error: null,
    loading: false,
  },
  reducers: {
    clearMsg: (state) => {
      state.message = null;
      state.error = null;
    },
    setSocket: (state, { payload }) => {
      state.socket = payload;
    },
    setMessages: (state, { payload }) => {
      state.chats[payload.slug] = payload.data;
    },
    setNewMessage: (state, { payload }) => {
      state.chats[payload.slug] == undefined
        ? (state.chats[payload.slug].messages = [payload.newMessage])
        : state.chats[payload.slug].messages.unshift(payload.newMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleChatAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleChatAPI.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(getSingleChatAPI.fulfilled, (state, { payload, meta }) => {
        state.chats[meta.arg.slug] = payload.messages;
        state.loading = false;
      })
      .addCase(sendMessageAPI.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(sendMessageAPI.fulfilled, (state, { payload, meta }) => {
        state.chats[meta.arg.slug] == undefined
          ? (state.chats[meta.arg.slug] = [payload.newMessage])
          : state.chats[meta.arg.slug].push(payload.newMessage);
      })

      .addCase(addChat.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addChat.fulfilled, (state, { payload }) => {
        state.chats.unshift(payload.chat);
        state.message = payload.message;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteChat.fulfilled, (state, { payload }) => {
        state.chats = state.chats.filter(
          (chat) => chat._id !== payload.chat._id
        );
        state.message = payload.message;
      })
      .addCase(updateChat.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateChat.fulfilled, (state, { payload }) => {
        state.chats[
          state.chats.findIndex((chat) => chat._id == payload.chat._id)
        ] = payload.chat;
        state.message = payload.message;
      });
  },
});

export const selectChat = (state) => state.chat;

export const { clearMsg, setSocket, setMessages, setNewMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
