'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:SignInCtrl
 * @description
 * # SignInCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('SignInCtrl', ['$scope', '$state', '$log', 'init',
    function($scope, $state, $log, init) {

      init('SignInCtrl', true, function() {
      });

      $scope.login = function() {
        $log.debug('LOGIN!');

        $state.go('join');
      };

    }]);
