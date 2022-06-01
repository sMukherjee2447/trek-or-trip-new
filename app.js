require('dotenv').config()
const express = require('express');
const req = require('express/lib/request');
var path = require('path');
const bodyParser = require('body-parser')
var createError = require('http-errors');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const User = require('./models/user')
const jwt = require('jsonwebtoken')


mongoose.connect("mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/trek-or-trip", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected on app.js'))
  .catch(e => console.log(e));




const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));
app.use(express.static(path.join(__dirname, 'public/uploads')));
// app.use(express.static(path.join(__dirname, 'public/vendor')));

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

var registrationRouter = require('./routes/registration-page')
app.use('/registration', registrationRouter)

var searchRouter = require('./routes/search-page')
app.use('/search', searchRouter)

var browseRouter = require('./routes/browse-page')
app.use('/browse', browseRouter)

var placebrowseRouter = require('./routes/placebrowse')
app.use('/category', placebrowseRouter)

var placedetailsRouter = require('./routes/browsepackage-page')
app.use('/packages', placedetailsRouter)

var allReviewRouter = require('./routes/allReview')
app.use('/all-reviews', allReviewRouter)

var reviewRouter = require('./routes/review')
app.use('/review', reviewRouter)

var gallerydetailsRouter = require('./routes/gallery-package_browse-page')
app.use('/package', gallerydetailsRouter)

var contactRouter = require("./routes/contact-us")
app.use('/contact', contactRouter)

var aboutRouter = require('./routes/about-us')
app.use('/about', aboutRouter)

var faqRouter = require('./routes/faq')
app.use('/faq', faqRouter)

var comingsoonRouter = require('./routes/comingsoon')
app.use('/comingsoon', comingsoonRouter)

var bookingRouter = require('./routes/booking-special')
app.use('/booking', bookingRouter)

var confirmationRouter = require('./routes/confirmation')
app.use('/confirmation', confirmationRouter)

var bookingsRouter = require('./routes/booking-gallery')
app.use('/bookings', bookingsRouter)

var editprofileRoute = require('./routes/editprofile')
app.use('/editprofile', editprofileRoute)

var myprofileRoute = require('./routes/myprofile')
app.use('/myprofile', myprofileRoute)

var notfoundRoute = require('./routes/404')
app.use('/notfound', notfoundRoute)

var adminRoute = require('./routes/admin-login')
app.use('/admin', adminRoute)

var dashboardRoute = require('./routes/dashboard')
app.use('/dashboard', dashboardRoute)

var loginfirstRoute = require('./routes/login-first');
const {
  access
} = require('fs');
app.use('/loginfirst', loginfirstRoute)


app.get("/logout", async (req, res) => {

  const token = req.cookies.JWT
  const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
  console.log(verifyUser)

  const user_data = await User.findOne({
    register_token: verifyUser.token
  })
  console.log(user_data)
  req.token = token
  req.user_data = user_data
  try {
    res.clearCookie("JWT")

    console.log("logout successful")

    // await req.user_data.save()

    res.redirect('/')

  } catch (error) {
    // res.status(500).send(error)
    res.render('/loginfirst')
  }
})


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
  res.redirect('/notfound')
});



app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})

module.exports = app