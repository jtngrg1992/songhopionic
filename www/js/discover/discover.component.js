angular
.module('discover').
component('discoverComponent',{
  templateUrl:'templates/discover.html',
  controller: ['$ionicLoading','$timeout','User','Recommendations',function discoverController(loader,$timeout,User,Recommendations){
    var self = this;

    self.showLoading = function(){
        loader.show({
          template: '<i class="ion-load-c"></i>',
          noBackdrop: true
        });
    };

    self.hideLoading = function(){
      loader.hide();
    };


    self.showLoading();
    Recommendations.init().
      then(function(){
        self.currentSong = Recommendations.queue[0];
        return Recommendations.playCurrentSong();

    }).
    then(function(){
      self.hideLoading();
      self.currentSong.loaded = true;
    });

    self.nextAlbumImage = function(){
      if (Recommendations.queue.length > 1){
        return Recommendations.queue[1].image_large;
      }
      return '';
    }

    self.sendFeedback = function sendFeedback(bool){
      Recommendations.nextSong();
      self.currentSong.rated = bool;
      self.currentSong.hide = true;

      if (bool)
        //add to user's favorites
        User.addToFavorites(self.currentSong);

      $timeout(function(){
        self.currentSong = Recommendations.queue[0];
      },250);
      Recommendations.playCurrentSong().then(function(){
        self.currentSong.loaded = true
      })
    }


  }]
});
