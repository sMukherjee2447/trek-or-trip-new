const express = require('express');
const req = require('express/lib/request');
var path = require('path');

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));

// app.get('/', (req, res) => {
//   res.render('landing-page.ejs')
// })

//Routings
var indexRouter = require('./routes/landing-page')
app.use('/', indexRouter)

var homeRouter = require('./routes/home-page')
app.use('/home', homeRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})