'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.chatService
 * @description
 * # chatService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .service('chatService', ['$q', '$http', '$timeout', '_', 'authService', 'CONFIG',
    function($q, $http, $timeout, _, authService, CONFIG) {

      var service = {};

      var listener = $q.defer();
      var socket = {
        client: null,
        stomp: null
      };
      var inputIds = [];

      service.RECONNECT_TIMEOUT = 30000;
      service.SOCKET_URL = CONFIG.apiEndpoint + '/chat';
      service.CHAT_TOPIC = '/topic/input';
      service.CHAT_BROKER = '/app/chat';

      var notify = function(output) {
        // You could be better :(
        var id = Math.floor(Math.random() * 1000000);
        output.id = id;

        socket.stomp.send(service.CHAT_BROKER, {priority: 9}, JSON.stringify(output));

        inputIds.push(id);
      };

      var leave = function() {
        var deferred = $q.defer();

        var authConfig = authService.getAuthConfig();
        $http.post(CONFIG.apiEndpoint + '/leave', {}, authConfig).then(function() {
          var data = JSON.stringify({
            token: authService.getToken()
          });

          notify({type: 'LEAVE', data: data});

          deferred.resolve();
        });

        return deferred.promise;
      };

      service.join = function() {
        var deferred = $q.defer();

        var authConfig = authService.getAuthConfig();
        $http
          .get(CONFIG.apiEndpoint + '/join', authConfig)
          .success(function(response) {
            var data = JSON.stringify({
              token: authService.getToken()
            });

            notify({type: 'JOIN', data: data});

            deferred.resolve(response.authors);
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

        leave().then(function() {
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

      var reconnect = function() {
        $timeout(function() {
          initialize();
        }, this.RECONNECT_TIMEOUT);
      };

      var startListener = function() {
        socket.stomp.subscribe(service.CHAT_TOPIC, function(data) {
          var input = JSON.parse(data.body);
          input.time = new Date(input.time);

          var inputId = input.id;
          if (_.contains(inputIds, inputId)) {
            input.self = true;
            inputIds = _.without(inputIds, inputId);
          }

          listener.notify(input);
        });
      };

      var initialize = function() {
        socket.client = new SockJS(service.SOCKET_URL);// jshint ignore:line
        socket.stomp = Stomp.over(socket.client);// jshint ignore:line
        socket.stomp.connect({}, startListener);
        socket.stomp.onclose = reconnect;
      };

      initialize();

      return service;

    }]);
