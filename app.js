const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

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

// Data sanitization againts noSQL query injection
app.use(mongoSanitize());

// Data sanitization againts XSS - (Cross side scripting attacks)
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingQuantity', 'ratingAverage', 'maxGroupSize', 'difficulty', 'price']
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));


// Test middlewares
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});



// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//all means all the http methods - crud
app.all('*', (req, res, next) => {
  //by specifing parameter in next its automaticly knows to go to error middleware
  //so we pass in our made error handling class with the mesaage and the status.
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//By specifing 4 parameters the middleware recognize its a Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
