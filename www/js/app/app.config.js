angular.module('songhop')
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('splash',{
    url:'/',
    template: '<splash-component></splash-component>',
    onEnter: function($state, User){
      User.checkSession().
      then(function(hasSession){
        if (hasSession) $state.go('tab.discover');
        else console.log("no session found")
      })
    }
  })
  // Set up an abstract state for the tabs directive:
  .state('tab', {
    url: '/tab',
    abstract: true,
    template: "<tab-component></tab-component>",
    onEnter: function($state, User){
      User.checkSession().then(function(hasSession) {
        if (!hasSession) $state.go('splash');
      });
    },
    // don't load the state until we've populated our User, if necessary.
    resolve: {
      populateSession: function(User) {
        return User.checkSession();
      }
    },
  })

  // Each tab has its own nav history stack:

  .state('tab.discover', {
    url: '/discover',
    views: {
      'tab-discover': {
        template: '<discover-component></discover-component>'
      }
    }
  })

  .state('tab.favorites', {
      url: '/favorites',
      views: {
        'tab-favorites': {
          template: '<favorites-component></favorites-component>'
        }
      }
    })
  // If none of the above states are matched, use this as the fallback:
  $urlRouterProvider.otherwise('/');

}])
