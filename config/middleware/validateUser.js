const createError = require("http-errors");
const Joi = require("../middleware/BaseJoi");

module.exports = validateUser = (req, res, next) => {
  const userSchemaValidator = Joi.object({
    username: Joi.string().required().escapeHTML(),
    email: Joi.string().required().escapeHTML(),
    password: Joi.string().required().escapeHTML(),
  });

  const { error } = userSchemaValidator.validate(req.body);
  if (error) {
    next(createError(400, error));
  } else {
    next();
  }
};
