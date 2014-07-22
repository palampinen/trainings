angular.module('treenit.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, AppAuth, Trainings, User) {
  
  var startApp = function() {
    
    // Set a flag that we finished the intro
    window.localStorage['didIntro'] = true;
    
    // Disable back
    /*
    $ionicViewService.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    }); 
    */
    
    
    Trainings.all()
    .then(function(data) {
      
      $state.go('app.dash');
      $scope.closeLogin();

    }, function(data) {
      // call returned an error
      alert('Treenejä ei saatu haettua');
    });
    
    
    //$state.go('app.dash');
    
  };

  // Form data for the login modal
  $scope.user = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/intro.html', {
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
    console.log('Doing login', $scope.user);

  if(AppAuth.validateAuth($scope.user)){
    AppAuth.auth($scope.user)
    .then(function(data) {
        if(data.result == "1"){
          User.save(data);
          $timeout( startApp , 500);
        }else{
          alert('Tunnukset eivät kelpaa');
        }
    }, function(data) {
        // call returned an error
        alert('Yhteysongelma');
    });
  }

    /*
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
    */

  };
})

/*
*
*  INTRO 
*
*/
.controller('IntroCtrl', function($scope, $state, $location, User, AppAuth, Trainings, $ionicViewService,$timeout) {
  
  

  var startApp = function() {

    // Set a flag that we finished the intro
    window.localStorage['didIntro'] = true;
    
    // Disable back
    /*
    $ionicViewService.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    }); 
    */
    
    Trainings.all()
    .then(function(data) {
      $state.go('app.dash');

    }, function(data) {
      // call returned an error
      alert('Treenejä ei saatu haettua');
    });
    
    
    //$state.go('app.dash');
    
  };
  
  if( User.isAuthed()){
    startApp();
    return;
  }
  
  
  $scope.user = User.all();

  $scope.tryAuth = function() { 
    

    var credentials = {
      "username": $scope.user.username,
      "password": $scope.user.password,
      "center"  : $scope.user.center
    };
    //var credentials = $scope.user;
  
    if(AppAuth.validateAuth(credentials)){

      AppAuth.auth(credentials)
      .then(function(data) {
        // call was successful

        //console.log(data);
        if(data.result == "1"){
          User.save(data);
          $timeout( startApp, 500);
        }else
          alert('Tunnukset eivät kelpaa');
        
      }, function(data) {
        // call returned an error
        alert('Yhteysongelma');

      });
    }
  }
  

})



.controller('DashCtrl', function (Trainings, $scope) {
  


  $scope.thisweek      = 3;
  $scope.weekAverage   = 3.9;
  $scope.total         = 500;
  $scope.thisYearCount = 103;
  $scope.past30Days    = 14;




   CanvasJS.addColorSet("mainChartColors",
                [
          "#45CCBE",
         // "rgba(56,216,198,.7)",
          "rgba(0,0,0,.05)"      
                ]);
  
  var chart = new CanvasJS.Chart("mainChart",
  {
      backgroundColor:'transparent',
      animationEnabled: false,
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
  
  
     CanvasJS.addColorSet("mainChartColors2",
                [
          "#5E8CD6",
         // "rgba(56,216,198,.7)",
          "rgba(0,0,0,.05)"      
                ]);
    var chart2 = new CanvasJS.Chart("mainChart2",
  {
      backgroundColor:'transparent',
      animationEnabled: false,
      interactivityEnabled: false,
      theme: "theme1",
      colorSet: 'mainChartColors2',
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
        {  y: 9  },
        {  y: 21 }
        ]
      }
      ]
  });
  chart2.render();

})

//TMP
.controller('PlaylistsCtrl', function($scope,Treenidata,$state) {
 
  var months = Treenidata.monthCalendarFromBeginning();
  $scope.months = months;
  
  //console.log( $scope.months)

  $scope.getItemHeight = function(item,index){
    return item.weeks.length * 62 + 100;
  }
  

})

//TMP
.controller('BrowseCtrl', function($scope, $state, Treenidata, User, $timeout) {
  $scope.treenidata = Treenidata.all();
  $scope.userdata = User.get();


  $scope.clearData = function() {
    User.clear(); 
    $timeout(function(){
          $state.go('app.browse')
    },1000)
  };

  $scope.updateData = function() {
    Treenidata.setData(0,'comments','VIPARIT')
  };

  $scope.removeData = function() {
    Treenidata.removeData(0,'comments');
  };

})


.controller('TimelineCtrl', function($scope, $state,Treenidata) {
  
  var months = Treenidata.monthCalendarFromBeginning();
  $scope.months = months;
  

  $scope.getItemHeight = function(item,index){
    return item.weeks.length * 62 + 100;
  }
  
  $scope.changeState = function () {
    $state.go('app.timelinelist');
  };
    
  
})
  
.controller('TimelineDetailCtrl', function($scope, $stateParams,Treenidata) {
  

  $scope.date = $stateParams.date;
  $scope.treenit = Treenidata.trainingsOfDay($stateParams.date);
  
console.log($scope.treenit)

  $scope.updateTrainType = function(id,tid,val){ //id,tid,val
    console.log(id,tid,val)
    Treenidata.setTrainTypeData(id,tid,val)

    console.log($scope.treenit)
  }
  
  var traintypes = [
    { id: 0, name: 'Aerobinen', icon:'aero' },
    { id: 1, name: 'Jalat', icon:'leg' },
    { id: 2, name: 'Selkä', icon:'back' },
    { id: 3, name: 'Rinta', icon:'chest' },
    { id: 4, name: 'Kädet', icon:'hand' },
    //{ id: 5, name: 'Hauis', icon:'hand' },
    //{ id: 6, name: 'Ojentaja', icon:'hand' },
    { id: 5, name: 'Vatsa', icon:'ab' },
    
  ];
  
  $scope.traintypes = traintypes;
  
})
  
.controller('TimelineListCtrl', function($scope, Treenidata) {
  
  var days = Treenidata.all();
  $scope.days = days;
  
  console.log(days);

  /*
  $scope.getItemHeight = function(item,index){
    return item.weeks.length * 62 + 100;
  }
  */
  
  
})


.controller('PulseCtrl', function($scope, Treenidata) {
  
  var d = new Date();
  var monthdata = Treenidata.yearActivityChartCJS(2,'spline')
  


  CanvasJS.addColorSet("treeniShades",
          [
          "#666",
          "#45CCBE",
          "#333",
          "#222"                
          ]);

  var chart = new CanvasJS.Chart("chart_div",
    {
      colorSet:  "treeniShades",
      backgroundColor: "transparent",
      theme:"theme1",
      title:{
      //text: "",
      fontFamily:"RobotoLight",
      fontweight: "100"
      },
      axisX :{
      includeZero: false,
      labelFontFamily: "RobotoLight",
      labelFontColor:"#eee",
      labelFontSize:10,
      lineColor: "#222",
      lineThickness: 1,
      tickColor: "#000",
      gridThickness: 1,
      gridColor: '#222',
      stripLines:[
        {
        thickness:1,
        value: d.getMonth() + (d.getDate() / 32),
        color:"#fff"
        }
      ]
      },
      axisY :{
      includeZero: true,
      labelFontFamily: "RobotoLight",
      labelFontColor:"#eee",
      lineColor: "#000",
      tickColor: "#000",
      gridThickness: 1,
      gridColor: '#333',
      maximum: 30
      
      },
      toolTip: {
      shared: "true"
      },
      legend:{
      fontFamily:  "RobotoThin",
      fontColor:"#eee",
      fontSize:22,
      cursor:"pointer",
      itemclick : function(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
        e.dataSeries.visible = false;
        }
        else {
        e.dataSeries.visible = true;
        }
        chart.render();
      }
      
      },
      data: monthdata,
      
    });

    chart.render();
    
  

  
  
  var months = [
    'tammi',
    'helmi',
    'maalis',
    'huhti',
    'touko',
    'kesä',
    'heinä',
    'elo',
    'syys',
    'loka',
    'marras',
    'joulu'
  ];
  
  
  
  
  $scope.thisMonthName  = months[d.getMonth()];
  $scope.thisDay      = d.getDate();
  $scope.thisYearCount  = Treenidata.thisYearCount();
  $scope.lastYearCount  = Treenidata.yearCountToDate( d.getFullYear()-1, new Date(d.getFullYear()-1, d.getMonth(),d.getDate()));

  
  
  $scope.weekAverage   = 0;
  $scope.total     = 0;
  $scope.thisYearCount = 0;
  $scope.past30Days    = 0;
  
  $scope.weekAverage    = Treenidata.weeklyAverage();
  $scope.total      = Treenidata.count();
  $scope.thisYearCount  = Treenidata.thisYearCount();
  $scope.past30Days     = Treenidata.latestCountByDays(30);
  
  
})

/*
.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})
*/

.controller('AccountCtrl', function($scope, User) {

  $scope.user = User.all();
  
  $scope.save = function() {
    $scope.User.$save();
    //$location.path('/');
  };
  
});