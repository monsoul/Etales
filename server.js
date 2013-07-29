var http = require("http");
var url = require("url");
var mongoose = require('mongoose');

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }
  mongoose.connect('mongodb://localhost/Etales');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
  	http.createServer(onRequest).listen(8888);
  	console.log("Server has started.");
  });
}
exports.start = start;