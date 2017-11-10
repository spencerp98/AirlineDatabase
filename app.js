var express = require("express");
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//app.set('port', XXXXX); //USE THIS ON FLIP

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render('home');
})

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

//DELETE THIS ON FLIP
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Express started; press Ctrl-C to terminate.');
});

/* USE THIS ON FLIP
app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
*/