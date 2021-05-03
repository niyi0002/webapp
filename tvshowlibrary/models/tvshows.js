var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TvShowSchema = new Schema(
  {
    title: {type: String, required: true},
    director: {type: String, required: true},
    summary: {type: String, required: true},
    poster:{type: String},
    id:{type:String},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
  }
);

// Virtual for tvshows's URL
TvShowSchema
.virtual('url')
.get(function () {
  return '/catalog/tvshow/' + this._id;
});

//Export model
module.exports = mongoose.model('TvShow', TvShowSchema);