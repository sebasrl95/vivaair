var bluemixHost = "https://app-testeo-konecta2.mybluemix.net";
//var bluemixHost = 'http://172.20.50.54:3000'
//var bluemixHost = 'http://172.20.5.73:3000'

// Check jQuery and inject if doesn't exist
if (typeof jQuery == 'undefined') {
    injectJquery();
} else {
    if (parseInt(jQuery.fn.jquery) < 2) {
        injectJquery();
    } else {
        initChat();
    }
}

// Function to inject jQuery
function injectJquery() {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = bluemixHost + "/scripts/jquery/dist/jquery.min.js";
    jqTag.onload = initChat;
    headTag.appendChild(jqTag);
}

// Initialization of chat
function initChat() {

    (function ($) {

        //Inject template
        $.get(bluemixHost + '/chat-template/chatmp', function (data) {
            $('body').last().append(data);
        });

        // Inject styles
        createStyle(bluemixHost + "/scripts/bootstrap/dist/css/bootstrap.min.css");
        createStyle("https://cdnjs.cloudflare.com/ajax/libs/lightgallery/1.6.11/css/lightgallery.min.css");
        createStyle("https://use.fontawesome.com/releases/v5.0.13/css/all.css");
        createStyle(bluemixHost + "/css/animate.min.css");
        createStyle(bluemixHost + "/css/chatmp.min.css");

        // Inject scripts
        createScript("https://cdn.jsdelivr.net/combine/npm/lightgallery,npm/lg-autoplay,npm/lg-fullscreen,npm/lg-thumbnail");
        createScript(bluemixHost + "/js/conversation.js");
        createScript(bluemixHost + "/js/api.js");
        createScript(bluemixHost + "/js/common.js");
        createScript(bluemixHost + "/js/BuildButtons.js");
        createScript(bluemixHost + "/js/botonesManager.js");
        createScript(bluemixHost + "/js/payload.js");
        createScript(bluemixHost + "/js/global.js");

    })(jQuery);
}

// Create link elements
function createStyle(url) {
    var link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
}

// Create script elements
function createScript(url, head = false) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = url;
    if (head) {
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        document.getElementsByTagName('body')[0].appendChild(script);
    }
}

function clearFields() {
    var texto = document.querySelector('#textInput');
    ConversationPanel.pasoMensaje(texto);
}

// Open chat window
function openChatbox() {
    var chatMP = document.getElementById("chatmp-konecta");
    chatMP.style.margin = null;
    document.querySelectorAll('#chatmp-konecta')[0].style.display = "block";
    dragElement(chatMP);
    chatMP.classList.add('animated');
    chatMP.classList.add('bounceInUp');
}

// Close chat window
function closeChatbox() {
    var chatMP = document.getElementById("chatmp-konecta");
    chatMP.style.margin = "0 0 -1500px 0";
    chatMP.style.top = null;
    chatMP.style.left = "10%";
    chatMP.style.bottom = "20px";
    document.querySelectorAll('#chatmp-konecta')[0].style.display = "none";
    chatMP.classList.remove('animated');
    chatMP.classList.remove('bounceInUp');
}

// Set chat draggable
function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}