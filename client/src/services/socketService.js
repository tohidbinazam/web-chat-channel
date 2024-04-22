import io from 'socket.io-client';
import { setMessages, setNewMessage } from '../features/chat/chatSlice';

let socket;

export const initializeSocket = () => {
  socket = io(import.meta.env.VITE_APP_API_URL);
};

export const connectSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const joinChannel = (slug, limit) => {
  if (socket) {
    socket.emit('join_channel', slug, limit);
  }
};

export const sendMessage = (slug, admin, msg) => {
  if (socket) {
    socket.emit('send_message', slug, admin, msg);
  }
};

export const subscribeToSetMessage = (dispatch) => {
  if (socket) {
    socket.on('set_message', (slug, data) => {
      dispatch(setMessages({ slug, data }));
    });
  }
};

export const unsubscribeFromSetMessage = () => {
  if (socket) {
    socket.off('set_message');
  }
};

export const subscribeToReceiveMessage = (dispatch) => {
  if (socket) {
    socket.on('receive_message', (slug, newMessage) => {
      dispatch(setNewMessage({ slug, newMessage }));
    });
  }
};

export const unsubscribeFromReceiveMessage = () => {
  if (socket) {
    socket.off('receive_message');
  }
};
