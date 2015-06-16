'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.initService
 * @description
 * # initService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .factory('init', ['$q', '$rootScope', '$state', '$log', '_', 'authService',
    function($q, $rootScope, $state, $log, _, authService) {

      var init = function init(controller, redirect, next) {
        var authenticated = authService.isAuthenticated();

        if (redirect && authenticated) {
          $state.transitionTo('join');
        } else if (_.isFunction(next)) {
          $log.debug('INIT [%s]', controller);
          next();
          $log.debug('END [%s]', controller);
        }
      };

      return init;

    }]);
