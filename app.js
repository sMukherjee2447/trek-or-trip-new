const express = require('express');
const req = require('express/lib/request');
var path = require('path');
const bodyParser = require('body-parser')
var createError = require('http-errors');

// const MongoClient = require('mongodb').MongoClient
const connection = require('./db-connect')

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var database

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.get('/', (req, res) => {
//   res.render('landing-page.ejs')
// })

//Routings
var indexRouter = require('./routes/landing-page')
app.use('/', indexRouter)

var homeRouter = require('./routes/home-page');
app.use('/home', homeRouter)

var signinRouter = require('./routes/signin-page')
app.use('/sign-in', signinRouter)


app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})

module.exports = app