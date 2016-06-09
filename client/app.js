var app = angular.module('app', ['ngMaterial']);

app.factory('Socket', function(){
  return io();
});

app.factory('User', function(Socket){
  var events = (function(){
    var topics = {};
    var hOP = topics.hasOwnProperty;

    return {
      subscribe: function(topic, listener) {
        if(!hOP.call(topics, topic)) topics[topic] = [];
        var index = topics[topic].push(listener) -1;
        return {
          remove: function() {
            delete topics[topic][index];
          }
        };
      },
      publish: function(topic, info) {
        if(!hOP.call(topics, topic)) return;
        topics[topic].forEach(function(item) {
            item(info != undefined ? info : {});
        });
      }
    };
  })();

  Socket.emit('train');

  Socket.on('trained', function(response) {
    console.log('trained', response);
    //events.publish('/lights', lights);
  });

  return {
    onVerify: function(cb){
      events.subscribe('/verify', cb);
    }
  };
});

app.directive('login', function(User){
  return {
    restrict: 'E',
    template: '<div>test</div>',
    scope: {},
    controller: function($scope){

    }
  };
});
