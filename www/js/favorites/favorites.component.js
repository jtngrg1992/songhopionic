angular.module('favorites').
component('favoritesComponent',{
  templateUrl:"templates/favorites.html",
  controller:['User','$window', function favoritesController(User,$window){
      var self = this;
      self.favorites = User.favorites;

      self.removeFromFav = function(song,index){
        User.removeFromFavorites(song,index);
      };

      self.openSong = function(song){
        $window.open(song.open_url,"system");
      };

  }]
});
