const Validator = require('./../../middlewares/validators/Validator');

module.exports = (req, res, next) => {
  let image_type = req._image ? req._image.type : '';

  let validateObject = req.body;
  let rules = {
    message: 'required'
  };

  if (req.files.image) {
    validateObject['image_type'] = req.files.image.type;
    rules['image_type'] = 'required|in:image/png,image/jpeg,image/jpg';
  }

  const validate = new Validator(validateObject, rules);

  if (validate.passes()) {
    next();
  } else {
    res.status(400).send(validate.errors);
  }
};
