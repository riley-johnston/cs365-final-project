var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

var officialPlayer1;
var officialPlayer2;
var p1Temp; // use as temp ship layout then when playing use as color layout
var p2Temp;

app.post("/updateArray", function(req, res){
    res.setHeader("Content-Type", "application/json");
    p1Temp = req.body.updatedShips;
    res.write(JSON.stringify(p1Temp));
    res.end();
});

app.listen(80, function() {
    console.log("Server is waiting on port 80");
});
