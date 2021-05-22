if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const { campSchema, reviewSchema } = require('./validationSchemas')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressErrors')
const methodOverride = require('method-override');
const { AsyncLocalStorage } = require('async_hooks');
const campRoutes = require('./routers/campRoutes')
const reviewRoutes = require('./routers/reviewRoutes')
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')
const userRoutes = require('./routers/userRoutes')
const helmet = require('helmet')
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const secret = process.env.SECRET || 'Some-Test-Secret'
const MongoStore = require('connect-mongo');

const mongoSanitize = require('express-mongo-sanitize')
//========================   Mongoose  =================================================
// mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
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
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(mongoSanitize())  // configuration against mongo injections
//===========================session configuration=========================
const store = MongoStore.create({
    mongoUrl: dbURL,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on('error', function (err) {
    console.log("SESSION STORE ERROR", err)
})

const sessionConfig = {
    store,
    name: 'SessionNameInsteadof_defaultOne',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // this will be added on the production/deployed site
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
//=======================FLASH===========================================
app.use(flash())

//======================passport configs=================================
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser()) //helps us to add user_id to the session/cookie
passport.deserializeUser(User.deserializeUser()) //removed that session_id when logout or expire

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})
//=====================     ROUTES     =====================================
app.use('/', campRoutes)
app.use('/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

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
