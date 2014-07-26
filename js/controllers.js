angular.module('treenit.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, AppAuth, Trainings, User) {
  


    $scope.currentuser = User.all();
    console.log('test');


  var startApp = function() {
    

    // Set a flag that we finished the intro
    window.localStorage['didIntro'] = true;
    
    // Disable back
    
    $ionicViewService.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    }); 
    
    
    
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



.controller('DashCtrl', function (Treenidata, $scope) {
  
  var d = new Date();
  $scope.currentActivity = {};
  $scope.thisweek      = Treenidata.thisweek();
  $scope.thismonth      = Treenidata.monthCount(d.getFullYear(),d.getMonth());
  var thisWeekTitle = 'Tällä viikolla';
  var thisMonthTitle = 'Tässä kuussa';

  $scope.currentActivity.num = $scope.thisweek;
  $scope.currentActivity.title = thisWeekTitle


  //Chart.js

  var ctxdata = [

    {
        value: 3,
        color: "rgba(255,255,255,.9)",
        highlight: "rgba(255,255,255,9)"
    },
    {
        value: 4,
        color:"rgba(255,255,255,.2)",
        highlight: "rgba(255,255,255,.2)"
    }
    ];
  var options = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : false,

    //String - The colour of each segment stroke
    segmentStrokeColor : "#FFF",

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 95, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 50,

    //String - Animation easing effect
    animationEasing : "easeOutQuart",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : false,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

};
  var ctx = document.getElementById("dashChartWeek").getContext("2d"),
      activityChart = new Chart(ctx).Doughnut(ctxdata,options);


  $scope.updateChart = function(flag) {
    if(flag){
      activityChart.segments[0].value = $scope.thismonth;
      activityChart.segments[1].value = 30-$scope.thismonth;
      activityChart.update();
      $scope.currentActivity.num = $scope.thismonth;
      $scope.currentActivity.title = thisMonthTitle;
    }
    else {
      activityChart.segments[0].value = $scope.thisweek;
      activityChart.segments[1].value = 7-$scope.thisweek;
      activityChart.update();
      $scope.currentActivity.num = $scope.thisweek;
      $scope.currentActivity.title = thisWeekTitle;

    }

  }


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
    { id: 0, name: 'Aerobinen', icon:'man329' },
    { id: 1, name: 'Jalat', icon:'leg5' },
    { id: 2, name: 'Selkä', icon:'back' },
    { id: 3, name: 'Rinta', icon:'shirtfront' },
    { id: 4, name: 'Kädet', icon:'bicep' },
    //{ id: 5, name: 'Hauis', icon:'hand' },
    //{ id: 6, name: 'Ojentaja', icon:'hand' },
    { id: 5, name: 'Vatsa', icon:'abdominals' },
    
  ];
  
  $scope.traintypes = traintypes;
  
})
  
.controller('TimelineListCtrl', function($scope, Treenidata) {
  
  var days = Treenidata.all();
  $scope.days = days;
  
  var traintypes = [
    { id: 0, name: 'Aerobinen', icon:'man329' },
    { id: 1, name: 'Jalat', icon:'leg5' },
    { id: 2, name: 'Selkä', icon:'back' },
    { id: 3, name: 'Rinta', icon:'shirtfront' },
    { id: 4, name: 'Kädet', icon:'bicep' },
    //{ id: 5, name: 'Hauis', icon:'hand' },
    //{ id: 6, name: 'Ojentaja', icon:'hand' },
    { id: 5, name: 'Vatsa', icon:'abdominals' },
    
  ];
  
$scope.traintypes = traintypes;
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
          "rgba(255,255,255,.5)",
          "#fff",
          "#ccc",
          "#bbb"                
          ]);

  var chart = new CanvasJS.Chart("chart_div",
    {
      colorSet:  "treeniShades",
      backgroundColor: "transparent",
      theme:"theme1",
      title:{
      //text: "",
      fontFamily:"Lato",
      fontweight: "100"
      },
      axisX :{
        includeZero: false,
        labelFontFamily: "Lato",
        labelFontColor:"#eee",
        labelFontSize:10,
        lineColor: "rgba(255,255,255,.3)",
        lineThickness: 1,
        tickColor: "transparent",
        gridThickness: 0,
        gridColor: 'rgba(255,255,255,.3)',
        stripLines:[
          {
          thickness:1,
          value: d.getMonth() + (d.getDate() / 32),
          color:"rgba(255,255,255,.2)"
          }
        ]
      },
      axisY :{
        includeZero: true,
        labelFontFamily: "Lato",
        labelFontColor:"#fff",
        lineColor: "transparent",
        tickColor: "transparent",
        gridThickness: 1,
        gridColor: 'rgba(255,255,255,.3)',
        maximum: 30
      
      },
      toolTip: {
      shared: "true"
      },
      legend:{
      fontFamily:  "Lato",
      fontWeight:300,
      fontColor:"#fff",
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