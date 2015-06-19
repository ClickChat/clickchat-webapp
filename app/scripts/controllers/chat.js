'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('ChatCtrl', ['$scope', '$timeout', '$location', '$state', '$log', '_', 'toastr', 'init', 'chatService',
    function($scope, $timeout, $location, $state, $log, _, toastr, init, chatService) {

      $scope.userDetails = {};
      $scope.messages = [];
      $scope.authors = [];
      $scope.message = '';

      init('ChatCtrl', false, function(userDetails) {
        $scope.userDetails = userDetails;

        chatService
          .join()
          .then(function(authors) {
            $scope.authors = authors;
          }, function(error) {
            $log.error(error);
          });
      });

      $scope.send = function() {
        var message = $scope.message;
        if (message) {
          chatService.send(message);

          $scope.message = '';
        }
      };

      $scope.leave = function() {
        chatService
          .leave()
          .then(function() {
            $state.go('join');
          }, function(error) {
            $log.error(error);
          });
      };

      $scope.logout = function() {
        chatService
          .logout()
          .then(function() {
            $state.go('sign-in');
          }, function(error) {
            $log.error(error);
          });
      };

      chatService.receive().then(null, null, function(input) {
        var id = input.id;
        var data = input.data;
        var time = input.time;
        var author = null;
        var authorId = null;
        switch (input.type) {
          case 'MESSAGE':
            var message = JSON.parse(data);
            authorId = message.author;
            if (authorId === $scope.userDetails.id) {
              author = _.pick($scope.userDetails, 'name', 'thumbnail');
            } else {
              author = _.findWhere($scope.authors, {id: authorId});
            }

            message.time = time;
            message.id = id;
            message.authorName = author.name;
            message.authorThumbnail = author.thumbnail;

            $scope.messages.push(message);
            $timeout(function() {
              $location.hash(id);
            });

            break;
          case 'LEAVE':
            author = JSON.parse(data);
            authorId = author.id;
            if (authorId !== $scope.userDetails.id) {
              $scope.authors = _.reject($scope.authors, function(author) {
                return (author.id === authorId);
              });

              toastr.info(author.name + ' leave the room!', 'Information');
            }

            break;
          case 'JOIN':
            author = JSON.parse(data);
            authorId = author.id;
            if (authorId !== $scope.userDetails.id) {
              var another = _.findWhere($scope.authors, {id: authorId});
              if (!another) {
                $scope.authors.push(author);
              }

              toastr.info(author.name + ' join to room!', 'Information');
            }

            break;
        }
      });

    }]);
