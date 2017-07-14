const fs = require('fs');

module.exports = (req, res, next) => {
  if (fs.existsSync(req._image_to_delete)) {
    fs.unlink(req._image_to_delete, next);
  } else {
    next();
  }
};
