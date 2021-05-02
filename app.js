const express = require('express');
const app = express();
const path = require('path');
const { campSchema, reviewSchema } = require('./validationSchemas')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
// const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressErrors')
// const Campground = require('./models/campground')
// const Review = require('./models/review')
const methodOverride = require('method-override');
const { AsyncLocalStorage } = require('async_hooks');
const campRoutes = require('./routers/campRoutes')
const reviewRoutes = require('./routers/reviewRoutes')
//========================   Mongoose  =================================================
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log("we are connected")
    })
    .catch((error) => {
        console.log("Can't connect to Database")
        console.log(error)
    })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log("Database connected") })
//=========================================================================
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))



//=====================     ROUTES     =====================================
app.use('/', campRoutes)
app.use('/reviews', reviewRoutes)


//============================================================================
app.all('*', (req, res, next) => {
    next(new ExpressError('Oh-oooh! Page Not Found ', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong' } = err;
    res.status(statusCode).render('error', { err });
})
//==========================================================================
app.listen(3000, () => {
    console.log("App is listening at port 3000")
})
