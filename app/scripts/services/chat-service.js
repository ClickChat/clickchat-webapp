'use strict';

/**
 * @ngdoc service
 * @name clickchatWebApp.chatService
 * @description
 * # chatService
 * Service in the clickchatWebApp.
 */
angular.module('clickchatWebApp')
  .service('chatService', ['$q', '$timeout', '_', 'CONFIG',
    function($q, $timeout, _, CONFIG) {

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

      service.receive = function() {
        return listener.promise;
      };

      service.send = function(output) {
        // You could be better :(
        var id = Math.floor(Math.random() * 1000000);
        output.id = id;

        socket.stomp.send(service.CHAT_BROKER, {priority: 9}, JSON.stringify(output));

        inputIds.push(id);
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
