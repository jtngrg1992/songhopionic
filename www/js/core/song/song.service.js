angular.module('core.song').
factory('Song',function($resource){
  return $resource('js/songs.json',{},{})
})
