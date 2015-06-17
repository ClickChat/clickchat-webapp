'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('JoinCtrl', ['$scope', '$state', '$log', '$translate', 'init', 'CONFIG',
    function($scope, $state, $log, $translate, init, CONFIG) {

      $scope.languages = {};

      init('JoinCtrl', false, function() {
        $scope.languages = CONFIG.languages;
      });

      $scope.changeLanguage = function(language) {
        $translate.use(language);
      };

      $scope.join = function() {
        $log.debug('JOIN!');

        $state.go('chat');
      };

      $scope.logout = function() {
        $log.debug('LOGOUT!');

        $state.go('sign-in');
      };

    }]);
