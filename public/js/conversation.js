// The ConversationPanel module is designed to handle
// all display and behaviors of the conversation column of the app.
/* eslint no-unused-vars: "off" */
/* global Api: true, Common: true*/
//var bluemixHost = 'https://app-testeo-konecta2.mybluemix.net';
var bluemixHost = 'http://172.20.50.54:5000';
var scrollingChat = '';
var retornoConsultaInicial = null;
var retornoConsultaFinal = null;
var responseWatsonCount = 0;
var capturaValorNodo;
var contextResponseBuild = [];

var ConversationPanel = (function () {
  var settings = {
    selectors: {
      chatBox: '#scrollingChat',
      fromUser: '.from-user',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    authorTypes: {
      user: 'user',
      watson: 'watson'
    }
  };

  // Publicly accessible methods defined
  return {
    init: init,
    inputKeyDown: inputKeyDown,
    pasoMensaje: pasoMensaje
  };

  // Initialize the module
  function init() {
    chatUpdateSetup();
    ApiChatVivaAir.sendRequest('', null);
    setupInputBox();
  }
  // Set up callbacks on payload setters in Api module
  // This causes the displayMessage functiosn to be called when messages are sent / received
  function chatUpdateSetup() {
    var currentRequestPayloadSetter = ApiChatVivaAir.setRequestPayload;
    ApiChatVivaAir.setRequestPayload = function (newPayloadStr) {
      currentRequestPayloadSetter.call(ApiChatVivaAir, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.user);
    };

    var currentResponsePayloadSetter = ApiChatVivaAir.setResponsePayload;
    ApiChatVivaAir.setResponsePayload = function (newPayloadStr) {
      currentResponsePayloadSetter.call(ApiChatVivaAir, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.watson);
      responseWatsonCount++;
    };
  }


  // Set up the input box to underline text as it is typed
  // This is done by creating a hidden dummy version of the input box that
  // is used to determine what the width of the input text should be.
  // This value is then used to set the new width of the visible input box.
  function setupInputBox() {
    var input = document.getElementById('textInput');
    var dummy = document.getElementById('textInputDummy');
    var minFontSize = 14;
    var maxFontSize = 16;
    var minPadding = 4;
    var maxPadding = 6;

    // If no dummy input box exists, create one
    // if (dummy === null) {
    //  var dummyJson = { 
    //   'tagName': 'div',
    //   'attributes': [{
    //    'name': 'id',
    //    'value': 'textInputDummy'
    //   }]
    //  };

    //  dummy = Common.buildDomElement(dummyJson);
    //  document.body.appendChild(dummy);
    // }

    function adjustInput() {
      if (input.value === '') {
        // If the input box is empty, remove the underline
        input.classList.remove('underline');
        input.setAttribute('style', 'width:' + '100%');
        input.style.width = '100%';
      } else {
        // otherwise, adjust the dummy text to match, and then set the width of
        // the visible input box to match it (thus extending the underline)
        input.classList.add('underline');
        var txtNode = document.createTextNode(input.value);
        // ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height',
        //  'text-transform', 'letter-spacing'
        // ].forEach(function(index) {
        //  dummy.style[index] = window.getComputedStyle(input, null).getPropertyValue(index);
        // });
        // dummy.textContent = txtNode.textContent;

        var padding = 0;
        var htmlElem = document.getElementsByTagName('html')[0];
        var currentFontSize = parseInt(window.getComputedStyle(htmlElem, null).getPropertyValue('font-size'), 10);
        if (currentFontSize) {
          padding = Math.floor((currentFontSize - minFontSize) / (maxFontSize - minFontSize) * (maxPadding - minPadding) + minPadding);
        } else {
          padding = maxPadding;
        }

        // var widthValue = (dummy.offsetWidth + padding) + 'px';
        // input.setAttribute('style', 'width:' + widthValue);
        // input.style.width = widthValue;
      }
    }

    // Any time the input changes, or the window resizes, adjust the size of the input box
    input.addEventListener('input', adjustInput);
    window.addEventListener('resize', adjustInput);

    // Trigger the input event once to set up the input box and dummy element
    Common.fireEvent(input, 'input');
  }

  // Display a user or Watson message that has just been sent/received
  function displayMessage(newPayload, typeValue) {
    var isUser = isUserMessage(typeValue);
    capturaValorNodo = newPayload;

    var textExists = (newPayload.input && newPayload.input.text) || (newPayload.output && newPayload.output.text);
    if (isUser !== null && textExists) {
      // Create new message DOM element
      var messageDivs = buildMessageDomElements(newPayload, isUser);
      var chatBoxElement = document.querySelector(settings.selectors.chatBox);
      var previousLatest = chatBoxElement.querySelectorAll((isUser ? settings.selectors.fromUser : settings.selectors.fromWatson) + settings.selectors.latest);
      // Previous "latest" message is no longer the most recent
      if (previousLatest) {
        Common.listForEach(previousLatest, function (element) {
          element.classList.remove('latest');
        });
      }

      messageDivs.forEach(function (currentDiv) {
        chatBoxElement.appendChild(currentDiv);

        var textoCambiar = currentDiv.textContent;
        var prueba = textoCambiar;
        try {
          scrollToChatBottom();
          if (capturaValorNodo.hasOwnProperty('output') === false) {
            $('#chat-typing').removeClass('invisible');
            $('#chat-typing').addClass('visible');
            document.querySelector('#textInput').disabled = true;

            if (capturaValorNodo.context != undefined) {
              if (capturaValorNodo.context.system.dialog_stack['0'].dialog_node === 'node_2_1527782008192' &&
                (capturaValorNodo.input.text === 'Correcto' || capturaValorNodo.input.text === 'Incorrecto')) {
                eliminardiv = document.getElementsByClassName('macro');
                document.querySelector('#scrollingChat > li:nth-child(' + ((eliminardiv.length)) + ')').remove();
                //document.querySelector('#scrollingChat > div:nth-child(' + ((eliminardiv.length)) + ')').remove()
              }
            }
          } else {
            if (responseWatsonCount > 0) {
              setTimeout(function () {
                $("#menu-button").delay(1000).removeClass("d-none");
              }, 1000);
            }

            if (capturaValorNodo.context.activarInput == true) {
              $('div.pane-action').removeClass('d-none');
              $('input#textInput').addClass('fadeIn');
            } else {
              $('div.pane-action').addClass('d-none');
              $('input#textInput').removeClass('fadeIn');
            }

            $('#chat-typing').removeClass('visible');
            $('#chat-typing').addClass('invisible');
            document.querySelector('#textInput').disabled = false;
            document.querySelector('#textInput').focus();

            // Consume webservice
            if (capturaValorNodo.output.webservice) {
              consumoServiciosGeneral(capturaValorNodo.output.webservice).then(function (result) {
                retornoConsultaFinal = result;
                console.log('retornoConsultaFinal', retornoConsultaFinal);
                var context = [];
                var latestResponse = ApiChatVivaAir.getResponsePayload();
                console.log(ApiChatVivaAir.getResponsePayload());

                if (latestResponse) {
                  context = latestResponse.context;
                }
                var peticion = capturaValorNodo.output.webservice
                peticion.forEach(element => {
                  outParameters = element.output;
                  for (var x in outParameters) {
                    //console.log(retornoConsultaFinal[outParameters[x]])
                    if (retornoConsultaFinal[outParameters[x]] == undefined)
                      retornoConsultaFinal[outParameters[x]] = null
                    context[outParameters[x]] = retornoConsultaFinal[outParameters[x]];
                  }
                })
                console.log(context)
                ApiChatVivaAir.sendRequest(null, context);
              }).catch(function (error) {
                console.log('Error: ', error);
              });

            }

            currentDiv.innerHTML = ArmarBotones(prueba);

            if (responseWatsonCount > 0) {
              var objConversation = document.getElementById("pane-conversation");
              $('.pane-conversation').animate({
                scrollTop: objConversation.scrollHeight
              }, 1000);
            }

            // Captura nodo captcha y carga Recaptcha de google
            if (prueba.includes('((captcha:')) {
              loadCaptcha();
            } else {
              $('div#captcha_container').parent().fadeOut(1000, function () {
                $(this).remove();
              });
              $('div#captcha_container').fadeOut(500, function () {
                $(this).remove();
              });
            }
          }
          scrollToChatBottom();
        } catch (error) {
          console.log('Error->', error);
        }
        // Class to start fade in animation
        currentDiv.classList.add('load');
      });
      // Move chat to the most recent messages when new messages are added
    }
  }

  // Checks if the given typeValue matches with the user "name", the Watson "name", or neither
  // Returns true if user, false if Watson, and null if neither
  // Used to keep track of whether a message was from the user or Watson
  function isUserMessage(typeValue) {
    if (typeValue === settings.authorTypes.user) {
      return true;
    } else if (typeValue === settings.authorTypes.watson) {
      return false;
    }
    return null;
  }

  // Constructs new DOM element from a message payload
  function buildMessageDomElements(newPayload, isUser) {
    var textArray = isUser ? newPayload.input.text : newPayload.output.text;
    if (Object.prototype.toString.call(textArray) !== '[object Array]') {
      textArray = [textArray];
    }
    var messageArray = [];
    textArray.forEach(function (currentText) {
      if (currentText) {
        var messageJson = {
          // <div class='segments'>
          'tagName': 'li',
          'classNames': ['segments'],
          'children': [{
            // <div class='from-user/from-watson latest'>
            'tagName': 'div',
            'classNames': [(isUser ? 'from-user' : 'from-watson'), 'latest', ((messageArray.length === 0) ? 'top' : 'sub')],
            'children': [{
              // <div class='message-inner'>
              'tagName': 'div',
              'classNames': ['msj-rta', 'macro'],
              'children': [{
                'tagName': 'div',
                'classNames': ['text', 'text-r'],
                'children': [{
                  'tagName': 'p',
                  // <p>{messageText}</p>
                  'text': currentText
                }]
              }]
            }]
          }]
        };
        pruebaHtml = Common.buildDomElement(messageJson);
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });

    return messageArray;
  }

  // Scroll to the bottom of the chat window (to the most recent messages)
  // Note: this method will bring the most recent user message into view,
  //   even if the most recent message is from Watson.
  //   This is done so that the "context" of the conversation is maintained in the view,
  //   even if the Watson message is long.
  function scrollToChatBottom() {
    scrollingChat = document.querySelector('#scrollingChat');
    // Scroll to the latest message sent by the user
    var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser + settings.selectors.latest);
    if (scrollEl) {
      scrollingChat.scrollTop = scrollEl.offsetTop;
    }
  }

  // Handles the submission of input
  function inputKeyDown(event, inputBox) {
    // Submit on enter key, dis-allowing blank messages
    if (event.keyCode === 13 && inputBox.value) {


      // Retrieve the context from the previous server response
      var context;
      var latestResponse = ApiChatVivaAir.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }

      // Send the user message
      ApiChatVivaAir.sendRequest(inputBox.value, context);


      // Clear input box for further messages
      inputBox.value = '';
      Common.fireEvent(inputBox, 'input');
    }
  }

  function pasoMensaje(inputBox) {
    // Submit on enter key, dis-allowing blank messages
    if (inputBox.value) {
      // Retrieve the context from the previous server response
      var context;
      var latestResponse = ApiChatVivaAir.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }
      ApiChatVivaAir.sendRequest(inputBox.value, context);

      // Clear input box for further messages
      //inputBox.value = '';
      document.querySelector('#textInput').value = null;
      Common.fireEvent(document.querySelector('#textInput'), 'input');
    }
  }
}());