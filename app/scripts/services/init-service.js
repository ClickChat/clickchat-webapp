'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.initService
 * @description
 * # initService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .factory('init', ['$q', '$rootScope', '$state', '_', 'authService',
    function($q, $rootScope, $state, _, authService) {

      var init = function init(controller, redirect, next) {
        var authenticated = authService.isAuthenticated();

        if (redirect && authenticated) {
          $state.transitionTo('join');
        } else if (_.isFunction(next)) {
          console.log('INIT [%s]', controller);
          next();
          console.log('END [%s]', controller);
        }
      };

      return init;

    }]);
