'use strict';

const express        = require('express');
const app            = express();
const path           = require('path');
const socket         = require('./server');
const fs             = require('fs');
const bodyParser     = require('body-parser');

app.use(bodyParser.json());

app.use('/client', express.static(path.join(__dirname, '/client')));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const validate = (proposal) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, 'credentials.json'), (err, str) => {
      if(err) {
        reject(err);
      } else {
        let credentials = JSON.parse(str);
        resolve(credentials.password === proposal);
      }
    });
  });
};

app.post('/login', (req, res) => {
  validate(req.body.password)
    .then(state => res.json({ valid: state}))
    .catch(err => res.json({ valid: false }));
});

const server = require('http').Server(app);

socket(server);

server.listen(3333, function(){
  console.log('listening on *:3333');
});
