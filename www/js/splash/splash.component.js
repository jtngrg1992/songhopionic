angular.module('splash').
component('splashComponent',{
  templateUrl: 'templates/splash.html',
  controller: function splashController($state,User){
      var self = this

      self.submitForm = function(username, signingUp){
        User.auth(username,signingUp).
        then(function(){
          //success
          $state.go('/discover')
        },function(){
          alert("Hmm.. try another username")
        })
      }
  }
});
