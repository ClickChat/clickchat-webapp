'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.authService
 * @description
 * # authService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .factory('authService', ['$q', function($q) {

    function isAuthenticated() {
      return false;
    }

    function getAuthenticatedUser() {
      var deferred = $q.defer();

      if (isAuthenticated()) {
        var authenticatedUser = null;

        if (authenticatedUser) {
          deferred.resolve(authenticatedUser);
        } else {
          //TODO: getUser!
        }
      } else {
        deferred.reject('Not authenticated user!');
      }

      return deferred.promise;
    }

    return {
      isAuthenticated: isAuthenticated,
      getAuthenticatedUser: getAuthenticatedUser
    };

  }]);
