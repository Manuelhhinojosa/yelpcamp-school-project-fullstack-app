const Review = require("../../models/review");

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash(
      "error",
      "You don't have permission to do that! get da fac outtahere"
    );
    res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports = isReviewAuthor;
