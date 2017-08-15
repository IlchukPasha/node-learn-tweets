const { findIndex } = require('lodash');

module.exports = {
  allowed_by: (user_roles, need_role = "admin") => {
    return findIndex(user_roles, item => {
      return item === need_role;
    }) >= 0
  }
};