var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
    name: {type: String},
    email: {type: String, required: true},
    password: {},
  
  }
);

// Virtual for tvshows's URL
UserSchema
.virtual('url')
.get(function () {
  return '/catalog/user/login/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);