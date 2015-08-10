var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var _ = require("lodash");
var liquify = require('./liquify');

// consts
const PLUGIN_NAME = 'gulp-liquify';

// plugin level function (dealing with files)
function gulpLiquify(locals, options) {

  var settings = _.defaults(options || {}, {
    "base": false,
    "prefix": false
  });

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {

    if (file.isNull()) { return cb(null, file); }
    if (file.isStream()) { return this.emit('error', new PluginError('gulp-liquify',  'Streaming not supported')); }

    // Clone a fresh copy, so as not to affect others
    var tempLocals = locals ? _.clone(locals) : {};

    // Apply file specific locals
    if(file.locals) {
      tempLocals = _.defaults(file.locals, tempLocals);
    }

    liquify(file.contents.toString("utf-8"), tempLocals, settings.base || file.base, settings.prefix)
      .then(function(result) {
        file.contents = new Buffer(result, "utf-8");
        this.push(file);
        return cb();
      }.bind(this))
      .catch(function(err) {
        this.emit('error', err);
        return cb();
      }.bind(this));

  });

  // returning the file stream
  return stream;
};

gulpLiquify.liquify = liquify;

// exporting the plugin main function
module.exports = gulpLiquify;