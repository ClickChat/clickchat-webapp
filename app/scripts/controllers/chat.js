'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('ChatCtrl', ['$scope', '$state', '$log', 'init', 'authService',
    function($scope, $state, $log, init, authService) {

      $scope.userDetails = {};
      $scope.message = '';

      $scope.number = 20;

      init('ChatCtrl', false, function(userDetails) {
        $scope.userDetails = userDetails;
      });

      $scope.send = function() {
        $log.debug('SEND [%s]', $scope.message);

        $scope.message = '';
      };

      $scope.leave = function() {
        $state.go('join');
      };

      $scope.logout = function() {
        authService
          .logout()
          .then(function() {
            $state.go('sign-in');
          });
      };

      $scope.getNumber = function(num) {
        return new Array(num);
      };

    }]);
