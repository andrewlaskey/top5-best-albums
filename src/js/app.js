function contains( haystack, needle ) {
   for (var i in haystack) {
       if (haystack[i].albumName == needle) return i;
   }
   return -1;
}

var app = angular.module('top5app', ['ui.sortable','firebase']);

app.controller('AppControl', ['$scope', '$firebase',
  function($scope, $firebase) {

    var ref = new Firebase("https://top52014test.firebaseIO.com/");
    var sync = $firebase(ref.child('years').child('2014'));

    $scope.topList = sync.$asArray();

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

      if ( $scope.submissions.length < 10 ) {
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

    $scope.deleteItem = function(i) {
      $scope.submissions.splice(i, 1);
    };
  }
]);