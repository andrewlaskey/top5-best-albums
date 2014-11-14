function contains( haystack, needle ) {
   for (var i in haystack) {
       if (haystack[i].albumName == needle) return i;
   }
   return -1;
}

var app = angular.module('top5app', ['firebase']);

app.controller('AppControl', ['$scope', '$firebase',
  function($scope, $firebase) {

    $scope.submissions = [
      {
        bandName:'1st',
        albumName: 'Row'
      },
      {
        bandName:'2nd',
        albumName: 'Row'
      },
      {
        bandName:'3rd',
        albumName: 'row'
      }
    ];

    $scope.addAlbum = function(e) {

      if ( $scope.submissions.length <= 10 ) {
        if ( contains($scope.submissions, $scope.albumName) < 0 ) {
          $scope.submissions.push({
            bandName: $scope.bandName,
            albumName: $scope.albumName
          });
        }
      }

      $scope.bandName = "";
      $scope.albumName = "";
    };
  }
]);