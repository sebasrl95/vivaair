/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var fs = require('fs');
var app = express();
var net = require('net');
var cors = require('cors');
var crypto = require('crypto'),
    shasum = crypto.createHash('sha1');

//var xoauth2 = require("xoauth2");
var request = require("request");
var specialRequest = request.defaults({
    strictSSL: false
});

// Bootstrap application settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('./public')); // load UI from public folder
app.set("jsonp callback", true);

// Scripts
app.use('/scripts', express.static(__dirname + '/node_modules/'));

var soap = require('soap');

app.use(cors({
    credentials: true,
    origin: true
}));

// Response for template of chat
app.use('/chat-template/chatmp', function (request, response) {
    fs.readFile('./public/chat-template/chatmp.html', function (err, data) {
        // Allow origin to all
        response.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
    });
});

// Create the service wrapper
var conversation = new Conversation({
    // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    // username: '<username>',
    // password: '<password>',
    // url: 'https://gateway.watsonplatform.net/conversation/api',
    version_date: Conversation.VERSION_DATE_2017_04_21
});

app.post('/servicioGeneral', function (req, res) {
    var webServices = []
    webServices.push(JSON.parse(req.body.nombreServicio));
    webServices.forEach(webServiceGeneral => {
        soap.createClient(webServiceGeneral.urlservice, {
            request: specialRequest
        }, function (err, soapClient) {
            soapClient[webServiceGeneral.nameservice](webServiceGeneral.parameters, function (err, result) {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.json(result);
                //conversationContext.watsonContext["saldoCliente"] = result.ConsultaSaldosResult.string[0];
            });
        });
    });
})

// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
    try {
        if (JSON.stringify(req.body.trama) !== undefined) {
            var workspace = req.body.trama;
            process.env.WORKSPACE_ID = req.body.trama;
        } else {
            var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
        }

    } catch (error) { }

    if (!workspace || workspace === '<workspace-id>') {
        return res.json({
            'output': {
                'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
            }
        });
    }
    var payload = {
        workspace_id: workspace,
        context: req.body.context || {},
        input: req.body.input || {}
    };

    // Send the input to the conversation service
    conversation.message(payload, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.json(updateMessage(payload, data));
    });
});

app.post('/validateCaptcha', function (req, res) {
    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({
            "responseCode": 1,
            "responseDesc": "Please select captcha"
        });
    }
    // Put your secret key here.
    var secretKey = "6LenbngUAAAAAFTM7mfOTU_ve693UL_aHjBxadXj";
    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, function (error, response, body) {
        
        if (error != null) {
            console.error(error);
            return res.json({
                "responseCode": 1,
                "responseDesc": "Please select captcha"
            });
        }

        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.json({
                "responseCode": 1,
                "responseDesc": "Failed captcha verification"
            });
        }
        res.json({
            "responseCode": 0,
            "responseDesc": "Success"
        });
    });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
    var responseText = null;
    if (!response.output) {
        response.output = {};
    } else {
        return response;
    }
    if (response.intents && response.intents[0]) {
        var intent = response.intents[0];
        if (intent.confidence >= 0.75) {
            responseText = 'I understood your intent was ' + intent.intent;
        } else if (intent.confidence >= 0.5) {
            responseText = 'I think your intent was ' + intent.intent;
        } else {
            responseText = 'I did not understand your intent';
        }
    }
    response.output.text = responseText;
    return response;
}

module.exports = app;