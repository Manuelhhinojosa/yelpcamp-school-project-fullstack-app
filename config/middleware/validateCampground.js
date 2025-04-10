const createError = require("http-errors");
const Joi = require("../middleware/BaseJoi");

module.exports = validateCampground = (req, res, next) => {
  const campgroundSchemaValidator = Joi.object({
    title: Joi.string().escapeHTML(),
    price: Joi.number().min(0),
    images: Joi.array(),
    location: Joi.string().escapeHTML(),
    description: Joi.string().escapeHTML(),
    deleteImages: Joi.array(),
  });
  const { error } = campgroundSchemaValidator.validate(req.body);
  if (error) {
    next(createError(400, error.details.map((el) => el.message).join(",")));
  } else {
    next();
  }
};
