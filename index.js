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
//This Section Works

if (checkedURL == "Please input valid URL"){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({"error": checkedURL}));
  res.end();
  return
}
//URL entered -- verifyed then add dataset 2MB max size for DB
mongo.connect(process.env.MONGOLAB_URI,function(err,db){
//get number of records & add to DB
var currentRecord = db.collection('urlstorage').count(function(err, docs){
db.collection('urlstorage').insert({short: docs+1, long:checkedURL})
res.writeHead(200, { 'Content-Type': 'application/json' });
res.write(JSON.stringify({"short": "https://arcane-gorge-62849.herokuapp.com/" + (docs+1),"long": checkedURL}));
res.end();});
});
db.close();
//After the Else is broken and I am puzzled why
} else {
//this works
  usedURL = parseInt(sanitize(usedURL.substring(1)))
//This is the part that isn't working
  mongo.connect(process.env.MONGOLAB_URI,function(err,db){

var collection = db.collection('urlstorage')
var stuff = collection.findOne(({short: parsedInt(usedURL)},{long:1, short:0, _id:0}),function(err, doc){
  if(doc) //if it does
  {
      console.log(doc); // print out what it sends back
  }
  else if(!doc) // if it does not
  {
      console.log("Not in docs");
  }
});
db.close();
});

}});

server.listen(process.env.PORT || 8888);


function checkURL(testURL) {
  var testCase = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!testCase .test(testURL)) {
    return "Please input valid URL";
  } else {
    return testURL;
  }
}
