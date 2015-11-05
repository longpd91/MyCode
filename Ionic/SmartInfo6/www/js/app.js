// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova' ,'ngSanitize'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('loading-uid', {
    url: '/loading-uid',
    templateUrl: 'templates/loading-uid.html',
    controller: 'LoadingUID'
  })
  .state('login-page', {
    url: '/login-page',
    templateUrl: 'templates/login-page.html',
    controller: 'LoginCtrl'
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.change-pass', {
      url: '/change-pass',
      views: {
        'menuContent': {
          templateUrl: 'templates/change-pass.html',
          controller: 'ChangePassCtrl'
        }
      }
    })
    .state('app.listsubject', {
      url: '/listsubject',
      views: {
        'menuContent': {
          templateUrl: 'templates/listsubject.html',
          controller: 'ListTopicCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/listsubject/:topicId',
    views: {
      'menuContent': {
        templateUrl: 'templates/topic-content.html',
        controller: 'TopicContentCtrl'
      }
    }
  })
  .state('app.content-detail', {
    url: '/listsubject/:topicId/:contentId',
    views: {
      'menuContent': {
        templateUrl: 'templates/content-detail.html',
        controller: 'ContentDetailCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loading-uid');
});
