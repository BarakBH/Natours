const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//  setting out PUG (Templates) engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP headers
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
  directives: {
  defaultSrc: ["'self'", 'https:', 'http:','data:', 'ws:'],
  baseUri: ["'self'"],
  fontSrc: ["'self'", 'https:','http:', 'data:'],
  scriptSrc: [
  "'self'",
  'https:',
  'http:',
  'blob:'],
  styleSrc: ["'self'", 'https:', 'http:',"'unsafe-inline'"]
  }
  })
 );

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));  // body larger than 10 kb will not be accepted
app.use(express.urlencoded({ extended:true, limit: '10kb'}));
app.use(cookieParser());

// Data sanitization againts noSQL query injection
app.use(mongoSanitize());

// Data sanitization againts XSS - (Cross side scripting attacks)
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingQuantity', 'ratingAverage', 'maxGroupSize', 'difficulty', 'price']
}));


// Test middlewares
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});



// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);



//all means all the http methods - crud
app.all('*', (req, res, next) => {
  //by specifing parameter in next its automaticly knows to go to error middleware
  //so we pass in our made error handling class with the mesaage and the status.
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//By specifing 4 parameters the middleware recognize its a Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
