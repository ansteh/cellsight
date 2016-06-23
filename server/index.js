'use strict';
const socketio = require('socket.io');
const cellsight = require('./modules/cellsight');

module.exports = (server) => {
  cellsight.getCube().then(cube => {
    const io = socketio(server);

    io.on('connection', function(socket){

      socket.on('train', () => {
        socket.emit('trained', 'test');
      });

      socket.on('titles', function(res){
        socket.emit('titles', cube.getTitles());
      });



      socket.on('find-rows', (options) => {
        let rows = cube.findRows(options.columnTitle, options.text);
        let variations = rows.getVariationsOfColumn(options.columnTitle);

        socket.emit('find-rows', {
          req: options,
          variations: variations
        });
      });

      socket.on('get-rows', (options) => {
        let rows = cube.findRows(options.columnTitle, options.text);
        let variations = rows.getVariationsOfColumn(options.columnTitle);

        socket.emit('find-rows', {
          req: options,
          variations: variations
        });
      });

    });

  });
};
