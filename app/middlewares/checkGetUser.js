
module.exports = function(req, res, next) {
  if(req._user.role === "admin" || req._user.id === req.params.id){
    return next();
  }
  res.status(400).end();
};