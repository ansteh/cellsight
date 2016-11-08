app.directive('login', function(User){
  return {
    restrict: 'E',
    templateUrl: 'client/login/form.tpl.html',
    scope: {},
    controller: function($scope){
      $scope.password;

      $scope.login = function() {
        User.login($scope.password)
        .then(function() {
          console.log('success!');
        }, function() {
          console.log('login failed!');
        })
      }

      $scope.isVerified = function() {
        return User.isVerified();
      }
    }
  };
});
