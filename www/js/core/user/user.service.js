angular.module('core.user').
factory('User',function($http,$q,SERVER,$localstorage){
  var o = {
    "username": false,
    "sessionID": false,
    "favorites" : [],
    "newFavorites" : 0
  };

  o.addToFavorites = function(song){
    if (!song) return;
    o.favorites.unshift(song);
    o.newFavorites++;

    return $http.post(SERVER.url + '/favorites', {session_id: o.sessionID, song_id: song.song_id})
  };

  o.removeFromFavorites = function(song, index){
    if (!song) return;

    o.favorites.splice(index,1);

    return $http({
      method: 'DELETE',
      url: SERVER.url + '/favorites',
      params: {session_id: o.sessionID, song_id: song.song_id}
    });
  };

  o.populateFavorites = function() {
    return $http({
      method: 'GET',
      url: SERVER.url + '/favorites',
      params: { session_id: o.sessionID }
    }).success(function(data){
      // merge data into the queue
      o.favorites = data;
    });
  }



  o.favCount = function(){
    return o.newFavorites;
  };

  o.auth = function(username, signingUp){
    var authRoute;

    if (signingUp){
      authRoute = 'signup'
    }else{
      authRoute = 'login'
    }

    return $http.post(SERVER.url + "/" + authRoute, {username: username}).
      success(function(data){
        o.setSession(data.username, data.session_id, data.favorites);
    });
  }

  o.setSession = function(username, sessionID, favorites){
    if (username) o.username = username;
    if (sessionID) o.sessionID = sessionID;
    if (favorites) o.favorites = favorites;

    $localstorage.setObject('user',{username: username, sessionID: sessionID});
  }

  o.checkSession = function() {
   var defer = $q.defer();

   if (o.session_id) {
     // if this session is already initialized in the service
     defer.resolve(true);

   } else {
     // detect if there's a session in localstorage from previous use.
     // if it is, pull into our service
     var user = $localstorage.getObject('user');

     if (user.username) {
       // if there's a user, lets grab their favorites from the server
       o.setSession(user.username, user.session_id);
       o.populateFavorites().then(function() {
         defer.resolve(true);
       });

     } else {
       // no user info in localstorage, reject
       defer.resolve(false);
     }

   }

   return defer.promise;
 }

  // wipe out our session data
 o.destroySession = function() {
   $localstorage.setObject('user', {});
   o.username = false;
   o.sessionID = false;
   o.favorites = [];
   o.newFavorites = 0;
 }

  return o;
})
