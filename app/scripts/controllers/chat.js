'use strict';

/**
 * @ngdoc function
 * @name clickchatWebApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the clickchatWebApp
 */
angular.module('clickchatWebApp')
  .controller('ChatCtrl',
  ['$scope', '$timeout', '$location', '$state', '$log', '$moment', '_', 'Idle', 'toastr', 'init', 'chatService',
    function($scope, $timeout, $location, $state, $log, $moment, _, Idle, toastr, init, chatService) {

      $scope.userDetails = {};
      $scope.messages = [];
      $scope.authors = [];
      $scope.message = '';

      var setInputFocus = function() {
        angular
          .element('#input-message')
          .trigger('focus');
      };

      var leave = function() {
        chatService
          .leave()
          .then(function() {
            Idle.unwatch();
            $state.go('join');
          }, function(error) {
            $log.error(error);
          });
      };

      init('ChatCtrl', false, function(userDetails) {
        $scope.userDetails = userDetails;

        chatService
          .join()
          .then(function(room) {
            $scope.authors = room.authors;

            $scope.messages = _.map(room.messages, function(message) {
              var date = message.date;
              var author = message.author;

              //TODO: Translate timed labels
              return {
                id: message.id,
                message: message.message,
                date: new Date(date),
                dateLabel: $moment(date).fromNow(),
                authorName: author.name,
                authorThumbnail: author.thumbnail
              };
            });

            var lastMessage = _.last($scope.messages);
            if (lastMessage) {
              $location.hash(lastMessage.id);
            }

            Idle.watch();

            setInputFocus();
          }, function(error) {
            $log.error(error);
          });
      });

      $scope.send = function() {
        var message = $scope.message;
        if (message) {
          chatService.send(message);

          setInputFocus();

          $scope.message = '';
        }
      };

      $scope.leave = leave;

      $scope.logout = function() {
        chatService
          .logout()
          .then(function() {
            Idle.unwatch();
            $state.go('sign-in');
          }, function(error) {
            $log.error(error);
          });
      };

      $scope.$on('IdleStart', function() {
        //TODO: Translate Idle message
        toastr.warning('No user activity was detected!', 'Information');

        leave();
      });

      chatService
        .receive()
        .then(null, null, function(input) {
          if(input){
            var data = input.data;
            var author = null;
            var authorId = null;
            switch (input.type) {
              case 'MESSAGE':
                var message = JSON.parse(data);
                if(message){
                  var id = input.id;
                  var date = input.time;

                  authorId = message.author;
                  if (authorId === $scope.userDetails.id) {
                    author = _.pick($scope.userDetails, 'name', 'thumbnail');
                  } else {
                    author = _.findWhere($scope.authors, {id: authorId});
                  }

                  message.id = id;
                  message.date = new Date(date);
                  message.dateLabel = $moment(date).format('HH:mm');
                  message.authorName = author.name;
                  message.authorThumbnail = author.thumbnail;

                  $scope.messages.push(message);

                  $location.hash(id);
                }

                break;
              case 'LEAVE':
                author = JSON.parse(data);
                if(author){
                  authorId = author.id;
                  if (authorId !== $scope.userDetails.id) {
                    $scope.authors = _.reject($scope.authors, function(author) {
                      return (author.id === authorId);
                    });

                    //TODO: Translate Leave message
                    toastr.info(author.name + ' leave the room!', 'Information');
                  }
                }

                break;
              case 'JOIN':
                author = JSON.parse(data);
                if(author){
                  authorId = author.id;
                  if (authorId !== $scope.userDetails.id) {
                    var another = _.findWhere($scope.authors, {id: authorId});
                    if (!another) {
                      $scope.authors.push(author);
                    }

                    //TODO: Translate Join message
                    toastr.info(author.name + ' join to room!', 'Information');
                  }
                }

                break;
            }
          }
        });

    }]);
