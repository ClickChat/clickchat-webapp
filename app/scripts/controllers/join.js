'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('JoinCtrl', ['$scope', '$log', '$translate', 'init', 'CONFIG',
    function($scope, $log, $translate, init, CONFIG) {

      $scope.languages = {};

      init('JoinCtrl', false, function() {
        $scope.languages = CONFIG.languages;
      });

      $scope.changeLanguage = function(language) {
        $translate.use(language);
      };

      $scope.join = function() {
        $log.debug('JOIN!');
      };

      $scope.logout = function() {
        $log.debug('LOGOUT!');
      };

    }]);
