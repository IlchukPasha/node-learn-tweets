const Tweet = require('./../../models/tweet');
const Validator = require('./../../middlewares/validators/Validator');

module.exports = (req, res, next) => {
  let image_type = req._image ? req._image.type : '';

  let validateObject = {
    message: req.body.message
  };

  let validate = null;

  if (req._image) {
    validateObject.image_type = image_type;
    validate = new Validator(validateObject, Tweet.rules.with_image, Tweet.messages.tweet);
  } else {
    validate = new Validator(validateObject, Tweet.rules.without_image, Tweet.messages.tweet);
  }

  if (validate.passes()) {
    next();
  } else {
    res.status(400).send(validate.errors);
  }
};
