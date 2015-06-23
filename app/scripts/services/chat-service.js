'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.chatService
 * @description
 * # chatService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .factory('chatService', ['$q', '$http', '$timeout', '_', 'authService', 'CONFIG',
    function($q, $http, $timeout, _, authService, CONFIG) {

      var listener = $q.defer();
      var initialized = false;
      var connected = false;
      var toTransmit = [];
      var socket = {
        client: null,
        stomp: null
      };

      var service = {};

      var disconnect = function() {
        if (socket.client && socket.stomp) {
          socket.stomp.disconnect();
          socket.stomp = null;
          socket.client = null;

          connected = false;
          initialized = false;
        }
      };

      var reconnect = function() {
        if (connected) {
          $timeout(initialize, 30000);
        }
      };

      var transmit = function(output) {
        if (output) {
          // You could be better :(
          output.id = Math.floor(Math.random() * 1000000);
          socket.stomp.send(CONFIG.chatBroker, {priority: 9}, JSON.stringify(output));
        }
      };

      var startListener = function() {
        socket.stomp.subscribe(CONFIG.chatTopic, function(data) {
          var input = JSON.parse(data.body);

          listener.notify(input);
        });

        connected = true;
        if (!_.isEmpty(toTransmit)) {
          _.each(toTransmit, transmit);
          toTransmit = [];
        }
      };

      var initialize = function() {
        disconnect();

        socket.client = new SockJS(CONFIG.chatSocketURL);// jshint ignore:line
        socket.stomp = Stomp.over(socket.client);// jshint ignore:line
        socket.stomp.connect({}, startListener);
        socket.stomp.onclose = reconnect;

        initialized = true;
      };

      var notify = function(output) {
        if (!initialized) {
          initialize();
        }

        if (connected) {
          transmit(output);
        } else {
          toTransmit.push(output);
        }
      };

      var leave = function() {
        var deferred = $q.defer();

        var authConfig = authService.getAuthConfig();
        $http
          .post(CONFIG.apiEndpoint + '/leave', {}, authConfig)
          .then(function() {
            var data = JSON.stringify({
              token: authService.getToken()
            });

            notify({type: 'LEAVE', data: data});

            disconnect();

            deferred.resolve();
          });

        return deferred.promise;
      };

      service.join = function() {
        var deferred = $q.defer();

        var authConfig = authService.getAuthConfig();
        $http
          .get(CONFIG.apiEndpoint + '/join', authConfig)
          .success(function(room) {
            var data = JSON.stringify({
              token: authService.getToken()
            });

            notify({type: 'JOIN', data: data});

            deferred.resolve(room);
          })
          .error(function(data) {
            deferred.reject(data);
          });

        return deferred.promise;
      };

      service.leave = function() {
        return leave();
      };

      service.logout = function() {
        var deferred = $q.defer();

        leave()
          .then(function() {
            authService
              .logout()
              .then(function() {
                deferred.resolve();
              });
          });

        return deferred.promise;
      };

      service.receive = function() {
        return listener.promise;
      };

      service.send = function(message) {
        var data = JSON.stringify({
          token: authService.getToken(),
          message: message
        });

        notify({type: 'MESSAGE', data: data});
      };

      return service;

    }]);
