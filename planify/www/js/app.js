// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

    });
    $ionicPlatform.registerBackButtonAction(function (event) {
    event.preventDefault();
}, 100);
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "index.html",
        controller: 'HomeCtrl'
      })

      .state('signup', {
        url: '/signup',
        abstract: true,
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
      })

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.projects', {
        url: '/projects',
        views: {
          'tab-projects': {
            templateUrl: 'templates/tab-projects.html',
            controller: 'ProjectsCtrl'
          }
        }
      })


      .state('tab.tasks', {
        url: '/tasks',
        views: {
          'tab-tasks': {
            templateUrl: 'templates/tab-tasks.html',
            controller: 'TasksCtrl'
          }
        }
      })

      .state('tab.preferences', {
        url: '/preferences',
        views: {
          'tab-preferences': {
            templateUrl: 'templates/tab-preferences.html',
            controller: 'PreferencesCtrl'
          }
        }
      });


    $urlRouterProvider.otherwise("/");

  });
