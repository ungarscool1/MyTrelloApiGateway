const path = require('path')
const express = require('express');
const app = express()
const appName = 'YOUR_APP_NAME';
const serverIP = '127.0.0.1'
const serverPORT = 8080
const token = 'YOUR_OAUTH_TOKEN';
const key = 'YOUR_API_KEY';

app.listen(serverPORT)
app.get('/', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.status(403);
  response.json({status: 403, message: 'You are not allowed to use this api'})
})
app.get('/getToken', (request, response) => {
  response.redirect('https://trello.com/1/authorize?expiration=never&name='+appName+'&scope=read,write&response_type=token&key='+key);
})
app.get('/approuve/:card', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  var card = request.params.card
  var req = require("request");

  var options = { method: 'POST',
  url: 'https://api.trello.com/1/cards/'+card+'/labels?key='+key+'&token='+token,
  qs:
   { color: 'pink',
     name: 'Approuvée'} };

  req(options, function (error, res, body) {
       if (error) {
         response.status(500).json({status: 500, message: 'Server internal error, please contact server admin'});
       } else {
         response.status(response.statusCode).json({status: response.statusCode, message: body})
       }
  });
})
app.get('/getLastCard/:list', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  var list = request.param.list
  var req = require("request");
  var options = { method: 'GET',
  url: 'https://api.trello.com/1/lists/'+list+'/cards?key='+key+'&token='+token};

  req(options, function (error, res, body) {
    if (error) {
      response.status(503);
      response.json({status: 500, message: 'Server internal error, please contact server admin'});
    } else {
      response.status(200);
      var json = '{"result":true, "return":'+body+'}'
      obj = JSON.parse(json);
      response.send(obj.return[obj.return.length-1])
    }
  });

})
app.get('/getCards/:list', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  var list = request.param.list
  var req = require("request");
  var options = { method: 'GET',
  url: 'https://api.trello.com/1/lists/'+list+'/cards?key='+key+'&token='+token};

  req(options, function (error, res, body) {
    if (error) {
      response.status(500);
      response.json({status: 500, message: 'Server internal error, please contact server admin'});
    } else {
      response.status(200);
      response.send(body)
    }
  });

})
