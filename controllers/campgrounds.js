const createError = require("http-errors");
const Campground = require("../models/campground");
const cloudinary = require("../config/middleware/multer");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapboxToken });

const getAllCampgrounds = async (req, res, next) => {
  try {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/all-campgrounds", {
      allCampgrounds,
    });
  } catch (error) {
    next(createError(500, error));
  }
};

const getOneCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oneCampground = await Campground.findOne({
      _id: id,
    })
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");

    if (!oneCampground) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/one-campground", {
      oneCampground,
    });
  } catch (error) {
    next(createError(500, "ID not found"));
  }
};

const getNewCampgroundForm = (req, res, next) => {
  res.render("campgrounds/new-campground-form");
};

//

const createACampground = async (req, res, next) => {
  try {
    const geoData = await geoCoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
    const newCampground = await new Campground(req.body);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash("success", "Succesfully made a new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (error) {
    next(createError(400, error));
  }
};

//

const editOneCampgroundForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit-campground-form", { campground });
  } catch (error) {
    next(createError(500, error));
  }
};

const editOneCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const geoData = await geoCoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();

    const oldCamp = await Campground.findById(id);
    const oldImages = oldCamp.images;
    const editedCamp = await Campground.findByIdAndUpdate(id, req.body);
    if (req.files.length === 0) {
      editedCamp.images = oldImages;
    } else if (req.files) {
      const newImages = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));
      editedCamp.images.push(...newImages);
    }
    editedCamp.geometry = geoData.body.features[0].geometry;
    await editedCamp.save();

    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.cloudinary.uploader.destroy(filename);
        console.log("This is the file name", req.body.deleteImages);
      }
      await editedCamp.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", `Succesfully edited ${editedCamp.title} campground`);
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    next(createError(400, error));
  }
};

const deleteOneCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    for (let img of camp.images) {
      await cloudinary.cloudinary.uploader.destroy(img.filename);
    }
    await Campground.findOneAndDelete(id);
    req.flash("success", "Campground succesfully deleted");
    res.redirect("/campgrounds");
  } catch (error) {
    next(createError(500, error));
  }
};

module.exports = {
  getAllCampgrounds,
  getOneCampground,
  getNewCampgroundForm,
  createACampground,
  editOneCampgroundForm,
  editOneCampground,
  deleteOneCampground,
};
