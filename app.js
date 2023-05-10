const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
