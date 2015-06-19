'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:SignInCtrl
 * @description
 * # SignInCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('SignInCtrl', ['$scope', '$state', '$log', 'init', 'authService',
    function($scope, $state, $log, init, authService) {

      init('SignInCtrl', true, function() {
      });

      $scope.login = function() {
        authService
          .login()
          .then(function() {
            $state.go('join');
          }, function(error) {
            $log.error(error);
          });
      };

    }]);
