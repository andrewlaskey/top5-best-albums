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

    $scope.myData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          fillColor: 'rgba(220,220,220,0.5)',
          strokeColor: 'rgba(220,220,220,0.8)',
          highlightFill: 'rgba(220,220,220,0.75)',
          highlightStroke: 'rgba(220,220,220,1)',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          fillColor: 'rgba(151,187,205,0.5)',
          strokeColor: 'rgba(151,187,205,0.8)',
          highlightFill: 'rgba(151,187,205,0.75)',
          highlightStroke: 'rgba(151,187,205,1)',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    $scope.myOptions =  {
      // Chart.js options can go here.
    };

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

    //Angularjs-nvd3-directives Functions
    $scope.getBarChartData = function(data) {
      var displayData = [
        {
          'key': 'Series 1',
          'values' : [[1,0], [2,0], [3,0], [4,0], [5,0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0]]
        }
      ];

      for (var i in data) {
        var place = 11 - data[i].points;
        displayData[0].values[place - 1][1] += 1;
      }

      return displayData;
    };

    $scope.yAxisTickFormatFunction = function(){
        return function(d){
            return d.toString();
        }
    }

    $scope.colorFunction = function() {
      return function(d, i) {
        return '#477DCA';
      };
    }

    $scope.testSpotify = function() {
      Spotify.search('Nirvana', 'artist').then(function (data) {
        console.log(data);
      });
    };
  }
]);