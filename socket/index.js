import { Server } from 'socket.io';
import { set_status_online, set_status_offline } from '../controllers/auth.js';
import { chat_seen } from '../controllers/chat.js';

const socketIOHandler = (server, cors) => {
  const io = new Server(server, cors);

  io.on('connection', (socket) => {
    socket.on('send_message', async (data) => {
      socket.to(data.conversation_id).emit('recieve_message', data);
      socket.emit(`${data.from_user.id} self`, data);
    });

    socket.on('sent_message', (data) => {
      socket.emit(data, data);
    });

    socket.on('join_chat', (data) => {
      socket.join(data);
    });
    socket.on('leave_chat', (data) => {
      socket.leave(data);
    });

    socket.on('chat_seen', (data) => {
      chat_seen(data.id, data.conversation_id);
      socket.to(data.conversation_id).emit('chat_seen', data);
    });

    socket.on('typing', (data) => {
      socket.to(data.conversation_id).emit('typing', data);
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.conversation_id).emit('stop_typing', data);
    });

    socket.on('user_online', (data) => {
      console.log('online');
      set_status_online(data.user_id);
      socket.broadcast.emit('user_online', { user_id: data.user_id });

      // For video call
      socket.on('callUser', ({ userToCall, signalData, myId, name }) => {
        io.to(userToCall).emit('callUser', {
          signal: signalData,
          fromId: myId,
          name,
        });
      });

      socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
      });
      // ================

      socket.on('disconnect', () => {
        set_status_offline(data.user_id);
        socket.broadcast.emit('user_disconnected', { data });
      });
    });
  });
};

export default socketIOHandler;
