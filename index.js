var http = require('http')
var sanitize = require('sanitize-caja')
var url = require('url')
var connect = require('connect')
var mongo = require('mongodb')

var server = http.createServer(function (req, res) {
//Expected input /new/http://www.somewhere.com
//Expected output http://MyAppNameHere.herokuapp.com/0

//get url
var usedURL = url.parse(req.url).pathname;
//Sanitize URL (this will touch the DB and we want to ensure nothing extra gets in)
if (usedURL.substring(0,5) == "/new/") {
  console.log(usedURL);
//URL entered localhost:8888/new/http://www.google.com -> /new/http://www.google.com

}
//find next free record in DB 0-9, A-Z, a-z then 00-0z

//add url to db

//parse JSON response

});
server.listen(process.env.PORT || 8888);
