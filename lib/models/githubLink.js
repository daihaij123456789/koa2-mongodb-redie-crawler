var mongoose = require('mongoose');
var githubLinkSchema = require('../schemas/githubLink');
var githubLink = mongoose.model('GithubLink', githubLinkSchema);
module.exports = githubLink;