const fs = require('fs');
const Tweet = require('./../models/tweet');

module.exports = (req, res, next) => {
  if (req.files.image) {
    req._image = req.files.image;
    req._targetPath = Tweet.generatePath(req._image);
    fs.rename(req._image.path, req._targetPath, next);
  } else {
    next();
  }
};
