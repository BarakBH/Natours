const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');


const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/213hjk1/reviews
// GET /tour/3213213/reviews

router.use('/:tourId/reviews', reviewRouter);


router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(authController.protect, authController.restirctTo('admin', 'lead-guide', 'guide'), tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// /tours-within?distance=233, center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router
.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

router
.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restirctTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restirctTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect, authController.restirctTo('admin', 'lead-guide'), tourController.deleteTour);



module.exports = router;
