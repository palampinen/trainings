// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'treenit' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'treenit.controllers' is found in controllers.js
angular.module('treenit', ['ionic', 'treenit.controllers', 'treenit.services'])

.run(function($ionicPlatform,  $ionicViewService, $state, Trainings, User) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


// Goto Login or Get data
  if(!User.isAuthed()){

    //disable back
     $ionicViewService.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    }); 
    $state.go('app.intro')
  }else{
  Trainings.all()
    .then(function(data) {
      //console.log(data);  
    }, function(data) {
      // call returned an error
      alert('Yhteysongelma');
    });
  }


  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.intro', {
      url: "/intro",
      views: {
        'menuContent': {
          templateUrl: 'templates/intro_login.html',
          controller: 'IntroCtrl'
        }
      }
    })

    .state('app.dash', {
      url: "/dash",
      views: {
        'menuContent' :{
          templateUrl: "templates/dash.html",
          controller: 'DashCtrl'
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html",
          controller: 'BrowseCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    })

.state('app.timeline', {
      url: '/timeline',
      views: {
        'menuContent': {
          templateUrl: 'templates/app-timeline-ofscroll.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
  
  .state('app.timeline-detail', {
      url: '/timeline/:date',
      views: {
        'menuContent': {
          templateUrl: 'templates/app-timeline-detail.html',
          controller: 'TimelineDetailCtrl'
        }
      }
    })
  
  .state('app.timelinelist', {
      url: '/timelinelist',
      views: {
        'menuContent': {
          templateUrl: 'templates/app-timelinelist.html',
          controller: 'TimelineListCtrl'
        }
      }
    })
  
  

    .state('app.pulse', {
      url: '/pulse',
      views: {
        'menuContent': {
          templateUrl: 'templates/app-pulse.html',
          controller: 'PulseCtrl'
        }
      }
    })
  /*
    .state('app.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'menuContent': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })
  */
    .state('app.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/app-account.html',
          controller: 'AccountCtrl'
        }
      }
    })



    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dash');
});

