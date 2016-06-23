var app = angular.module('app', ['ngMaterial']);

app.factory('Socket', function(){
  return io();
});

app.factory('Cellsight', function(Socket){
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

  Socket.emit('titles');

  Socket.on('titles', function(res){
    //console.log(res);
    events.publish('/titles', res);
  });

  return {
    onVerify: function(cb){
      events.subscribe('/verify', cb);
    },
    onTitles: function(cb){
      events.subscribe('/titles', cb);
    }
  };
});

app.directive('login', function(Cellsight){
  return {
    restrict: 'E',
    template: '<div></div>',
    scope: {},
    controller: function($scope){

    }
  };
});

app.directive('inspectRow', function(Cellsight, Socket){
  return {
    restrict: 'E',
    templateUrl: 'client/inspect/row.tpl.html',
    scope: {},
    controller: function($scope){
      $scope.titles = [];
      $scope.title;
      $scope.text = '';
      $scope.variations = [];

      Cellsight.onTitles(function(titles){
        $scope.titles = titles;
        $scope.$apply();
      });

      $scope.findRows = function(){
        Socket.emit('find-rows', {
          columnTitle: $scope.title,
          text: $scope.text
        });
      };

      Socket.on('find-rows', function(res){
        $scope.variations = _.map(res.variations, function(text) {
          return {
            active: false,
            text: text
          };
        });

        $scope.hideInactives = false;
        $scope.$apply();
      });

      $scope.getRows = function(){
        Socket.emit('find-rows', {
          columnTitle: $scope.title,
          matches: _.chain($scope.variations)
            .filter(function(variation) {
              return variation.active;
            })
            .map(function(variation) {
              return variation.text;
            })
            .value()
        });
      };

      Socket.on('get-rows', function(res){
        console.log(res);
        $scope.$apply();
      });

      $scope.activate = function() {
        _.forEach($scope.variations, function(variation) {
          variation.active = true;
        });
      };

      $scope.deactivate = function() {
        _.forEach($scope.variations, function(variation) {
          variation.active = false;
        });
      };
    }
  };
});
