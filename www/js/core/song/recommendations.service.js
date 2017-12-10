angular.module('core').
factory('Recommendations',['$http','SERVER','$q',function($http,server,$q){
  var o = {
    queue: []
  };

  var media;

  o.init = function(){
    if (o.queue.length == 0){
      return o.getNextSongs();
    }else{
      return o.playCurrentSong();
    }
  }
  
  o.getNextSongs = function(){
    return $http({
      method: "GET",
      url: server.url + '/recommendations'
    }).success(function(response){
      o.queue = o.queue.concat(response);
    })
  }

  o.nextSong = function(){
    //pop the 0 index
    o.queue.shift();
    o.haultAudio();
    if (o.queue.length <= 3){
      o.getNextSongs();
    }
  }

  o.playCurrentSong = function(){
    var defer = $q.defer();

    media = new Audio(o.queue[0].preview_url);

    media.addEventListener('loadeddata',function(){
      defer.resolve();
    });

    media.play();

    return defer.promise;
  }

  o.haultAudio = function(){
    if (media){
      media.pause();
    }
  }



  return o;
}]);
