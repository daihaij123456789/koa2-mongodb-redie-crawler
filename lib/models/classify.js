var mongoose = require('mongoose');

var ClassifySchema = new mongoose.Schema({
	name: String,
	url: String
});
mongoose.model('Classify', ClassifySchema);