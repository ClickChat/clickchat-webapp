'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('ChatCtrl', ['$scope', '$timeout', '$location', '$state', '$log', 'init', 'authService', 'chatService',
    function($scope, $timeout, $location, $state, $log, init, authService, chatService) {

      $scope.userDetails = {};
      $scope.messages = [];
      $scope.authors = [];
      $scope.message = '';

      init('ChatCtrl', false, function(userDetails) {
        $scope.userDetails = userDetails;
        //
        $scope.authors.push(userDetails);
      });

      $scope.send = function() {
        var data = {
          token: authService.getToken(),
          message: $scope.message
        };

        chatService.send({
          type: 'MESSAGE', data: JSON.stringify(data)
        });

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

      chatService.receive().then(null, null, function(input) {
        var id = input.id;
        var data = input.data;
        var time = input.time;
        switch (input.type) {
          case 'MESSAGE':
            var message = JSON.parse(data);
            message.time = time;
            message.id = id;

            $scope.messages.push(message);
            $timeout(function() {
              $location.hash(id);
            });
            break;
          case 'LEAVE':
            break;
          case 'JOIN':
            break;
        }
      });

    }]);
