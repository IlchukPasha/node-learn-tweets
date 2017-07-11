
module.exports = function(req, res, next) {
  if(req._user.role !== "admin"){
    return res.status(400).end();
  }
  next();
};