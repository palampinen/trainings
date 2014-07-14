angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('DashCtrl', function (Trainings, $scope) {
  



  $scope.thisweek      = 3;
  $scope.weekAverage   = 3.9;
  $scope.total         = 500;
  $scope.thisYearCount = 103;
  $scope.past30Days    = 14;




   CanvasJS.addColorSet("mainChartColors",
                [
          //"#45CCBE",
          "rgba(56,216,198,.7)",
          "rgba(116,217,206,.04)"      
                ]);
  
  var chart = new CanvasJS.Chart("mainChart",
  {
      backgroundColor:'transparent',
      animationEnabled: true,
      interactivityEnabled: false,
      theme: "theme1",
      colorSet: 'mainChartColors',
      toolTip: {
        enabled:false
      },
      data: [
      {     
        type: "doughnut",
        indexLabelFontFamily: "Raleway",       
        indexLabelFontSize: 20,
        startAngle:-90,
        indexLabelLineColor: "#CCC", 
      //  toolTipContent: "{y}",          

        dataPoints: [
        {  y: $scope.thisweek  },
        {  y: 7-$scope.thisweek }
        ]
      }
      ]
  });

  chart.render();


})




.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
