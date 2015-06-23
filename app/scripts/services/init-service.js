'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.initService
 * @description
 * # initService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .factory('init', ['$q', '$state', '$log', '_', 'authService', 'CONFIG',
    function($q, $state, $log, _, authService, CONFIG) {

      var init = function init(controller, redirect, next) {
        var isAuthenticated = authService.isAuthenticated();

        if (redirect && isAuthenticated) {
          $state.transitionTo('join');
        } else if (_.isFunction(next)) {
          if (isAuthenticated) {
            authService
              .getAuthenticatedUser()
              .then(function(userDetails) {
                if (!userDetails.thumbnail) {
                  userDetails.thumbnail = CONFIG.defaultThumbnail;
                }

                next(userDetails);
              }, function(error) {
                //TODO: Add forbidden page!
                $log.error('Error getting userDetails!', error);
              });
          } else {
            next();
          }
        }
      };

      return init;

    }]);
