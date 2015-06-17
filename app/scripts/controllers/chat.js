'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('ChatCtrl', ['$scope', '$state', '$log', 'init',
    function($scope, $state, $log, init) {

      $scope.message = '';

      $scope.number = 20;

      init('ChatCtrl', false, function() {
      });

      $scope.send = function() {
        $log.debug('SEND [%s]', $scope.message);

        $scope.message = '';
      };

      $scope.leave = function() {
        $log.debug('LEAVE!');

        $state.go('join');
      };

      $scope.logout = function() {
        $log.debug('LOGOUT!');

        $state.go('sign-in');
      };

      $scope.getNumber = function(num) {
        return new Array(num);
      };

    }]);
