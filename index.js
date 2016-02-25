var http = require('http')
var sanitize = require('sanitize-caja')
var url = require('url')
var connect = require('connect')
var mongo = require('mongodb')
var mongoose = require("mongoose")

var server = http.createServer(function (req, res) {
//Expected input /new/http://www.somewhere.com
//Expected output http://MyAppNameHere.herokuapp.com/0

//get url
var usedURL = url.parse(req.url).pathname;
//Sanitize URL (this will touch the DB and we want to ensure nothing extra gets in)
if (usedURL.substring(0,5) == "/new/") {
var sanitizedURL = sanitize(usedURL.substring(5))
var checkedURL = checkURL(sanitizedURL)
if (checkedURL == "Please input valid URL"){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({"error": checkedURL}));
  res.end();
  return
}
//URL entered -- verifyed then add dataset 2MB max size for DB
mongo.connect(process.env.MONGOLAB_URI,function(err,db){
//get number of records
var currentRecord = db.collection('urlstorage').count(function(err, docs){
db.collection('urlstorage').insert({"short": docs+1, "long":checkedURL})});
});
} else {
  usedURL = sanitize(usedURL.substring(1))
  //console.log(usedURL)
  mongo.connect(process.env.MONGOLAB_URI,function(err,db){

var stuff = db.collection('urlstorage').find({"short": usedURL},function(err, doc){
if (err){
  res.writeHead(200, JSON.stringify({"location": "Invalid Short URL"}));
  res.end();
}
res.writeHead(200, JSON.stringify(doc));
res.end();
//res.writeHead(301, {"location": redirectURL.long});
//res.end();
});


//res.writeHead(301, {"location": redirectURL.long});
//res.end();

});

//    res.writeHead(200, JSON.stringify({"location": redirectURL}));
//    res.end();
  //Recall here



//    res.writeHead(301, {"location": 'http://www.google.com'});
//    res.end();



}
//Check if retreving



});
server.listen(process.env.PORT || 8888);


function checkURL(testURL) {
  var testCase = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!testCase .test(testURL)) {
    return "Please input valid URL";
  } else {
    return testURL;
  }
}
