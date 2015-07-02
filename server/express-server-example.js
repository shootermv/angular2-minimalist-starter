var express = require('express');

// Express App
var app = express();
var appPort = 8080;




// Your middleware
app.use(express.static('public'));


server.listen(appPort, function() {
  console.log('Listen on http://localhost:' + appPort);
});
