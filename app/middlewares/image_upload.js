const fs = require('fs');

const Tweet = require('./../models/tweet');

module.exports = (req, res, next) => {
  if (req.files.image) {
    req._image = req.files.image;
    let targetPath = Tweet.generatePath(req._image);
    fs.rename(req._image.path, targetPath, err => {
      if (err) {
        return next(err);
      } else {
        req._targetPath = targetPath;
        next();
      }
    });
  }else{
    next();
  }
};
