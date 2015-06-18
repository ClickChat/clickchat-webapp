'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.authService
 * @description
 * # authService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .factory('authService', ['$rootScope', '$q', '$http', '$log', 'GooglePlus', 'localStorageService', 'CONFIG',
    function($rootScope, $q, $http, $log, GooglePlus, localStorageService, CONFIG) {

      $rootScope.userDetails = null;

      function getToken() {
        return localStorageService.get(CONFIG.tokenName);
      }

      function getAuthConfig() {
        return {headers: {'Authorization': getToken()}};
      }

      function setToken(token) {
        localStorageService.set(CONFIG.tokenName, token.tokenType + ' ' + token.accessToken);
      }

      function removeToken() {
        localStorageService.remove(CONFIG.tokenName);
      }

      function isAuthenticated() {
        return (getToken() != null);
      }

      function getAuthenticatedUser() {
        var deferred = $q.defer();

        if (isAuthenticated()) {
          var userDetails = $rootScope.userDetails;

          if (userDetails) {
            deferred.resolve(userDetails);
          } else {
            var authConfig = getAuthConfig();
            $http
              .get(CONFIG.apiEndpoint + '/me', authConfig)
              .success(function(userDetail) {
                $rootScope.userDetails = userDetail;

                deferred.resolve(userDetail);
              })
              .error(function(data) {
                deferred.reject(data);
              });
          }
        } else {
          deferred.reject('Not authenticated user!');
        }

        return deferred.promise;
      }

      function login() {
        var deferred = $q.defer();

        GooglePlus.login().then(function(authResult) {
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          var token = {
            accessToken: authResult.access_token, // jshint ignore:line
            tokenType: authResult.token_type // jshint ignore:line
          };
          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          $http
            .post(CONFIG.apiEndpoint + '/auth', token)
            .success(function(userDetail) {
              setToken(userDetail.token);

              $rootScope.userDetails = userDetail;

              deferred.resolve(userDetail);
            })
            .error(function(data) {
              deferred.reject(data);
            });
        }, function(error) {
          deferred.reject(error);
        });

        return deferred.promise;
      }

      function logout() {
        var deferred = $q.defer();

        var authConfig = getAuthConfig();
        $http.post(CONFIG.apiEndpoint + '/logout', {}, authConfig).then(function() {
          $rootScope.userDetails = null;
          removeToken();

          deferred.resolve();
        });

        return deferred.promise;
      }

      return {
        isAuthenticated: isAuthenticated,
        getAuthenticatedUser: getAuthenticatedUser,
        login: login,
        logout: logout,
        getToken: getToken
      };

    }

  ])
;
