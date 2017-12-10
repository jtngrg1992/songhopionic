angular.module('tab').
component('tabComponent',{
  templateUrl:'templates/tabs.html',
  controller: ['Recommendations','User',function tabController(recommendations,user){
    var self = this;

    self.favCount = user.favCount;
    console.log(self.favCount);

    self.enteringFavorites = function(){
        recommendations.haultAudio();
        user.newFavorites = 0
    };

    self.leavingFavorites = function(){
      recommendations.init();
    };
  }]
});
