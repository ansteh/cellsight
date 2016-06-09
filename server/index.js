'use strict';
const socketio = require('socket.io');

module.exports = (server) => {
  const io = socketio(server);

  io.on('connection', function(socket){

    socket.on('train', () => {
      socket.emit('trained', 'test');
    });

  });
};
