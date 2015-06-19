'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('JoinCtrl', ['$scope', '$state', '$translate', 'init', 'authService', 'CONFIG',
    function($scope, $state, $translate, init, authService, CONFIG) {

      $scope.languages = {};
      $scope.userDetails = {};

      init('JoinCtrl', false, function(userDetails) {
        $scope.languages = CONFIG.languages;
        $scope.userDetails = userDetails;
      });

      $scope.changeLanguage = function(language) {
        $translate.use(language);
      };

      $scope.join = function() {        
        $state.go('chat');
      };

      $scope.logout = function() {
        authService
          .logout()
          .then(function() {
            $state.go('sign-in');
          });
      };

    }]);
