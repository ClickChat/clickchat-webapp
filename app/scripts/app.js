'use strict';

/**
 * @ngdoc overview
 * @name clickchatWebApp
 * @description
 * # clickchatWebApp
 *
 * Main module of the application.
 */
angular

  .module('clickchatWebApp', [
    'angular-loading-bar',
    'ngAnimate',
    'toastr',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule',
    'googleplus',
    'pascalprecht.translate',
    'underscore',
    'angular-momentjs',
    'ngIdle'
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider',
    '$logProvider', 'GooglePlusProvider', 'localStorageServiceProvider', 'IdleProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider,
             $logProvider, GooglePlusProvider, localStorageServiceProvider, IdleProvider) {

      // Safely writes the message into the browser's console
      $logProvider.debugEnabled(true);

      // Add routing table
      $stateProvider
        .state('sign-in', {
          url: '/sign-in',
          templateUrl: 'views/sign-in.html',
          controller: 'SignInCtrl',
          authenticate: false
        })
        .state('join', {
          url: '/join',
          templateUrl: 'views/join.html',
          controller: 'JoinCtrl',
          authenticate: true
        })
        .state('chat', {
          url: '/chat',
          templateUrl: 'views/chat.html',
          controller: 'ChatCtrl',
          authenticate: true
        });

      // Add default route
      $urlRouterProvider.otherwise('sign-in');

      // Add translation table
      $translateProvider
        .useStaticFilesLoader({
          'prefix': '/i18n/locale-',
          'suffix': '.json'
        })
        .registerAvailableLanguageKeys(['en', 'pt', 'es'], {
          'es_419': 'es',
          'pt_BR': 'pt',
          'pt_PT': 'pt',
          'en_US': 'en',
          'en_GB': 'en',
          'en_UK': 'en'
        })
        .determinePreferredLanguage()
        .fallbackLanguage('en')
        .useSanitizeValueStrategy('escaped')
        .useLocalStorage();

      var scopes = 'https://www.googleapis.com/auth/plus.login ' +
        'https://www.googleapis.com/auth/userinfo.email ' +
        'https://www.googleapis.com/auth/userinfo.profile';

      // Init Google+ provider
      GooglePlusProvider.init({
        clientId: '739262140361-b6ombrge0f9tl0dkb29dg82uh4b24cs5.apps.googleusercontent.com',
        apiKey: 'eqbHrP4XqbfV_PzbffzTVWp0',
        scopes: scopes
      });

      // Config localStorage
      localStorageServiceProvider.setPrefix('CLICKCHAT');

      // Config Idle Settings
      IdleProvider.idle(30);

    }])

  .constant('CONFIG', {
    apiEndpoint: 'http://clickchat-api.acactown.org',
    chatSocketURL: 'http://clickchat-api.acactown.org/chat',
    chatTopic: '/topic/input',
    chatBroker: '/app/chat',
    tokenName: 'AUTH',
    defaultThumbnail: 'http://public.acactown.org/avatar.png',
    languages: [
      {label: 'Español', value: 'es'},
      {label: 'Portugues', value: 'pt'},
      {label: 'English', value: 'en'}
    ]
  })

  .run(['$rootScope', '$state', 'authService', function($rootScope, $state, authService) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (next.authenticate && !authService.isAuthenticated()) {
        event.preventDefault();

        $state.go('sign-in');
      }
    });
  }]);
