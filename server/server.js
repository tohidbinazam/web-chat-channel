import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import mongoDB from './config/mongoDB.js';
import authRoute from './router/authRoute.js';
import authAppRoute from './app/router/authAppRoute.js';
import subscriptionAppRoute from './app/router/subscriptionAppRoute.js';
import userRoute from './router/userRoute.js';
import roleRoute from './router/roleRoute.js';
import adminRoute from './router/adminRoute.js';
import permissionRoute from './router/permissionRoute.js';
import channelRoute from './router/channelRoute.js';
import messageRoute from './router/messageRoute.js';
import errorHandler from './utility/errorHandler.js';
import path from 'path';
import colors from 'colors';
import getMessagesDB from './message_to_db/getMessagesDB.js';
import sendMessageDB from './message_to_db/sendMessageDB.js';

dotenv.config();
mongoDB();

const __dirname = path.resolve();

const port = process.env.PORT || 5050;

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.DOMAIN.split(',')],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Web route
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/role', roleRoute);
app.use('/api/v1/permission', permissionRoute);
app.use('/api/v1/channel', channelRoute);
app.use('/api/v1/message', messageRoute);

// App route
app.use('/app/api/v1/auth', authAppRoute);
app.use('/app/api/v1/subscription', subscriptionAppRoute);

app.use(errorHandler);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.DOMAIN.split(',')],
    methods: ['GET', 'POST', 'PATCH'],
  },
});

io.on('connection', (socket) => {
  console.log(`Socket clint connect successfully ID ${socket.id}`);

  socket.on('app_join_channel', async (slug, limit, userID) => {
    socket.join(slug);
    const data = await getMessagesDB(slug, limit, userID);
    io.in(slug).emit('app_set_message', slug, data);
  });
  socket.on('app_leave_channel', (slug) => {
    socket.leave(slug);
  });

  socket.on('join_channel', async (slug, limit) => {
    socket.join(slug);
    const data = await getMessagesDB(slug, limit);
    io.in(slug).emit('set_message', slug, data);
  });

  socket.on('send_message', async (slug, admin, msg) => {
    const newMessage = await sendMessageDB(slug, admin, msg);
    io.in(slug).emit('receive_message', slug, newMessage);
  });
});

if (process.env.NODE_ENV === 'PRODUCTION') {
  console.log('Production mode');
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
  );
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`.bgCyan.black);
});
