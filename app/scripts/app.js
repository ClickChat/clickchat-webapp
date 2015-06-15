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
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'underscore'
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider) {

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
          authenticate: false
        })
        .state('chat', {
          url: '/chat',
          templateUrl: 'views/chat.html',
          controller: 'ChatCtrl',
          authenticate: false
        });

      // Default route
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
        .useLocalStorage();

    }])

  .constant('CONFIG', {
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