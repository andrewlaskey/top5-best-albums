var app = angular.module("top5app", ["firebase"]);

app.controller('AppControl', function($scope, $firebase) {
  var ref = new Firebase("https://top5.firebaseIO.com/");
  $scope.albums = [];
  angularFire(ref, $scope, "albums");
  $scope.addAlbum = function(e) {

    var index = contains($scope.albums, $scope.albumName);
    if ( index >= 0) {
      $scope.albums[index].score += (11 - $scope.userScore);
      $scope.albums[index].listnames += ', ' + $scope.userName;
    } else {
      $scope.albums.push({
        bandName: $scope.bandName,
        albumName: $scope.albumName,
        score: (11 - $scope.userScore),
        listnames: $scope.userName
      });  
    }
    
    $scope.bandName = "";
    $scope.albumName = "";
    $scope.userScore = "";
  };
}