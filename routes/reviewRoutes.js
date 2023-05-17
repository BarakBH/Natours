const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//merge params get the params from the outer router that called from the tour routes -> router.use('/:tourId/reviews', reviewRouter);
const router = express.Router({ mergeParams: true });   

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restirctTo('user'), reviewController.setTourUserIds, reviewController.createReview);

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restirctTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.restirctTo('user', 'admin'), reviewController.deleteReview);



module.exports = router;