var express = require("express");
var router = express.Router({ mergeParams: true });
const reviewsControllers = require("../controllers/reviews");
const validateReview = require("../config/middleware/validateReview");
const isUserAunthenticated = require("../config/middleware/isUserAuthenticated");
const isReviewAuthor = require("../config/middleware/isReviewAuthor");

router.post(
  "/",
  isUserAunthenticated,
  validateReview,
  reviewsControllers.createAReview
);

router.delete(
  "/:reviewId",
  isUserAunthenticated,
  isReviewAuthor,
  reviewsControllers.deleteAReview
);

module.exports = router;
