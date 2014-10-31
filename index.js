var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Promise = require("bluebird");
var _ = require("lodash");
var fs = require('fs');

// var Liquid = require("liquid-node");
// var engine = new Liquid.Engine;
var tinyliquid = require("tinyliquid");

// consts
const PLUGIN_NAME = 'gulp-liquify';

// Promisify to use readFileAsync
Promise.promisifyAll(fs);

// plugin level function (dealing with files)
function gulpLiquify(locals, options) {
  
  var settings = _.defaults(options || {}, {
    "base": false
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
    
    liquify(file.contents.toString("utf-8"), tempLocals, settings.base || file.base)
      .then(function(result) { 
        file.contents = new Buffer(result, "utf-8");
        this.push(file);
        return cb();
      }.bind(this));

  });

  // returning the file stream
  return stream;
};

function liquify(contents, locals, includeBase){
  var template;
  var context = tinyliquid.newContext({
      locals: locals
    });

  if(!contents) return;

  if(typeof contents != "string"){
    template = contents;
  } else {
    template = tinyliquid.compile(contents);
  }

  return new Promise(function (resolve, reject) {

    context.onInclude(function (name, callback) {
      fs.readFile((includeBase || "./") + name, 'utf8', function (err, text) {

        if (err) {
          reject(err);
          return callback(err);
        }

        var ast = tinyliquid.parse(text);
        callback(null, ast);
      });
    });

    template(context, function (err) {
      if (err) return reject(err);
      resolve(context.getBuffer());
    });
  });

};



// exporting the plugin main function
module.exports = gulpLiquify;