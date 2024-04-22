import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import adminSlice from '../features/admin/adminSlice';
import userSlice from '../features/user/userSlice';
import channelSlice from '../features/channel/channelSlice';
import chatSlice from '../features/chat/chatSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    admin: adminSlice,
    user: userSlice,
    channel: channelSlice,
    chat: chatSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
