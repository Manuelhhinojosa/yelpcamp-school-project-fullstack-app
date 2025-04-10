const createError = require("http-errors");
const Review = require("../models/review");
const Campground = require("../models/campground");

const createAReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const newReview = await new Review(req.body);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "Review added");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(createError(500, error));
  }
};

const deleteAReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    next(createError(500, error));
  }
};

module.exports = {
  createAReview,
  deleteAReview,
};
