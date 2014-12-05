function contains( haystack, needle ) {
   for (var i in haystack) {
       if (haystack[i].albumname == needle) return i;
   }
   return -1;
}



var app = angular.module('top5app', ['ui.sortable','firebase','spotify','nvd3ChartDirectives','tc.chartjs']);

app.controller('AppControl', ['$scope', '$firebase', 'Spotify',
  function($scope, $firebase, Spotify) {

    var ref = new Firebase("https://top52014test.firebaseIO.com/");
    var sync = $firebase(ref.child('years').child('2014'));

    $scope.albumList = sync.$asArray();

    $scope.submissions = [];

    $scope.barData = [];

    $scope.myOptions =  {
      // Chart.js options can go here.
    };
    
    $scope.albumList.$watch(function(event) {
      console.log(event);

      
        var objIndex = $scope.albumList.$indexFor(event.key);

        var newDataset = {
          labels: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th','9th', '10th'],
          datasets: [
            {
              label: '',
              fillColor: 'rgba(220,220,220,0.5)',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: 'rgba(220,220,220,0.75)',
              highlightStroke: 'rgba(220,220,220,1)',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          ]
        };

        newDataset.datasets[0].label = 'Votes for ' + $scope.albumList[objIndex].albumname;

        for (var k = $scope.albumList[objIndex].votes.length - 1; k >= 0; k--) {
          var place = 11 - $scope.albumList[objIndex].votes[k].points;

          newDataset.datasets[0].data[place - 1] += 1;
        }

        if (event.event == 'child_changed') {

          for (var i = $scope.barData.length - 1; i >= 0; i--) {
            if ($scope.barData[i].id === event.key) {
              $scope.barData[i].bardata = newDataset;
            }
          }
        }

        if (event.event == 'child_added') {
          $scope.barData.push({id: event.key, bardata: newDataset});
        }
    });

    $scope.addAlbum = function(e) {

      if ( $scope.submissions.length < 1 ) {
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
          $scope.albumList
            .$add({
              albumname: sub.albumname,
              bandname: sub.bandname,
              score: points,
              votes: [{
                user: $scope.userName,
                points: points
              }]
            }).then(function(ref) {
              var id = ref.key(),
                index = $scope.albumList.$indexFor(id);


              Spotify.search($scope.albumList[index].albumname, 'album', {limit: 1}).then(function (data) {
                
                $scope.albumList[index].spotifyID = data.albums.items[0].id;
                $scope.albumList[index].spotifyImage = data.albums.items[0].images[1].url;

                $scope.albumList.$save($scope.albumList[index]);
              });
            });
        } else {
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

    $scope.findById = function(source, id) {
      return source.filter(function( obj ) {
          // coerce both obj.id and id to numbers 
          // for val & type comparison
          return obj.id === id;
      })[ 0 ];
    };
  }
]);