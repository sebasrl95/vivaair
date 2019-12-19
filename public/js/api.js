// The Api module is designed to handle all interactions with the server

var ApiChatVivaAir = (function () {
  var requestPayload;
  var responsePayload;
  //var bluemixHost = 'https://vivaair.mybluemix.net'
  var bluemixHost = 'http://localhost:5000';
  var messageEndpoint = bluemixHost + '/api/message';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function () {
      return requestPayload;
    },
    setRequestPayload: function (newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function () {
      return responsePayload;
    },
    setResponsePayload: function (newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {
    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }

    if (context) {
      payloadToWatson.context = context;
    }

    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        ApiChatVivaAir.setResponsePayload(http.responseText);
      }
    };

    var params = JSON.stringify(payloadToWatson);
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      ApiChatVivaAir.setRequestPayload(params);
    }
    http.send(params);
  }
}());
