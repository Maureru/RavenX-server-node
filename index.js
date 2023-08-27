import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { config } from 'dotenv';
import authRouter from './routes/user.js';
import chatRoutes from './routes/chat.js';

import socketIOHandler from './socket/index.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

config();

const server = http.createServer(app);

app.use('/auth', authRouter);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('App is running!');
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MONGOOSE CONNECTED!');
  })
  .catch((err) => console.log('MongoDB Error'));

server.listen(PORT, () => console.log('Server is running on port: ', PORT));

socketIOHandler(server, {
  cors: {
    origin: 'https://ravens-x-xmauu.vercel.app',
    methods: ['GET', 'POST'],
  },
});
