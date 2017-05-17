// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'controllers', 'service', 'constants', 'ionic-datepicker', 'ionic-toast', 'ui.mask', 'filters', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider,$urlRouterProvider){
  $stateProvider
    .state('client',{
      url:'/client',
      abstract: true,
      templateUrl:'templates/client.html'
    })
    .state('client.list',{
      url:'/list',
      views:{
        'content':{
          templateUrl:'templates/client-list.html',
          controller:'listController',
        }
      },
      cache: false
    })
    .state('client.view',{
      url:'/view/:id',
      views:{
        'content':{
          templateUrl:'templates/client-view.html',
          controller:'viewController'
        }
      }
    })
    .state('client.edit',{
      url:'/edit/:id',
      views:{
        'content':{
          templateUrl:'templates/client-form.html',
          controller:'formController'
        }
      },
      cache: false
    })
    .state('client.create',{
      url:'/create',
      views:{
        'content':{
          templateUrl:'templates/client-form.html',
          controller:'formController'
        }
      },
      cache: false
    });
  $urlRouterProvider.otherwise('/client/list');

})

  .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Selecionar',
      todayLabel: 'Hoje',
      closeLabel: 'Fechar',
      mondayFirst: false,
      weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthsList: ["Jan", "Fev", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Set", "Out", "Nov", "Dez"],
      templateType: 'popup',
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  });
