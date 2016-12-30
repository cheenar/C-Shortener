//INCLUDES
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//VARIABLES
var app = express();

global.makeID = function makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

//SETUP LOKIJS
var loki = require("lokijs");
var db = new loki("urls.json", {
    autoload: true,
    autosave: true,
    autosaveInterval: 5000
});
db.loadDatabase({}, function(err, data) {
    if(err) {
        console.log(err);
    }
});
if (db.getCollection("URLS") == null) {
    db.addCollection("URLS");
}

global.addURL = function(str) {
    var id = makeID(6);
    db.getCollection("URLS").insert({
        link: [str, id]
    });
    return id;
};

global.getURL = function(id) {
    for(var x = 0; x < db.getCollection("URLS").data.length; x++) {
        if(db.getCollection("URLS").data[x].link[1] == id) {
            return db.getCollection("URLS").data[x].link[0];
        }
    }
    return "/";
}

//SETUP PUG VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//SETUP THE APP
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
var index = require("./routes/index");

//CONNECTION
app.use("/", index);

//BOILERPLATE CODE

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("Error");
});

module.exports = app;