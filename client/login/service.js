app.factory('User', function($http){
  var verified = false;

  var login = function(proposal) {
    return $http.post('/login', { password: proposal })
      .then(function(res) {
        console.log(res);
        verified = res.data.valid;
      });
  };

  var isVerified = function() {
    return verified;
  };

  return {
    login: login,
    isVerified: isVerified
  };
});
