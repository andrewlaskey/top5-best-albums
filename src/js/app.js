function contains( haystack, needle ) {
   for (var i in haystack) {
       if (haystack[i].albumname == needle) return i;
   }
   return -1;
}

var app = angular.module('top5app', ['ui.sortable','firebase','spotify']);

app.controller('AppControl', ['$scope', '$firebase', 'Spotify',
  function($scope, $firebase, Spotify) {

    var ref = new Firebase("https://top52014test.firebaseIO.com/");
    var sync = $firebase(ref.child('years').child('2014'));
    //var albumList = sync.$asArray();

    $scope.albumList = sync.$asArray();

    $scope.submissions = [
      {
        bandname:'1st',
        albumname: '1'
      },
      {
        bandname:'2nd',
        albumname: '2'
      },
      {
        bandname:'3rd',
        albumname: '3'
      }
    ];

    $scope.addAlbum = function(e) {

      if ( $scope.submissions.length < 10 ) {
        if ( contains($scope.submissions, $scope.albumname) < 0 ) {
          $scope.submissions.push({
            bandname: $scope.bandname,
            albumname: $scope.albumname
          });
        }
      }

      $scope.bandname = "";
      $scope.albumname = "";
    };

    $scope.deleteItem = function(i) {
      $scope.submissions.splice(i, 1);
    };

    $scope.submitAlbums = function() {
      for (var i in $scope.submissions) {
        var sub = $scope.submissions[i],
            points = 10 - i,
            index = contains($scope.albumList, sub.albumname);

        if ( index < 0 ) {
          $scope.albumList.$add({
            albumname: sub.albumname,
            bandname: sub.bandname,
            score: points,
            votes: [{
              user: $scope.userName,
              points: points
            }]
          });
        } else {
          console.log('i: ' + i);
          console.log('index: ' + index);
          console.log($scope.albumList[index]);

          $scope.albumList[index].score += points;
          $scope.albumList[index].votes.push({
              user: $scope.userName,
              points: points
          });
          $scope.albumList.$save($scope.albumList[index]);
        }
      }

      $scope.submissions = [];
    };

    $scope.testSpotify = function() {
      Spotify.search('Nirvana', 'artist').then(function (data) {
        console.log(data);
      });
    };
  }
]);