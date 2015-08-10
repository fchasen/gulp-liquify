var fs = require("fs");
var Promise = require("bluebird");
var tinyliquid = require("tinyliquid");
var path = require("path");

var liquify = function(contents, locals, includeBase, prefix){
  var template;
  var context = tinyliquid.newContext({
      locals: locals
    });

  if(!contents) {
    contents = '';
  };

  if(typeof contents != "string"){
    template = contents;
  } else {
    template = tinyliquid.compile(contents);
  }

  return new Promise(function (resolve, reject) {

    context.onInclude(function (name, callback) {

      var absolute = isAbsolute(name);
      var ext = path.extname(name);
      var filePath;

      if(!absolute) {

        if(prefix) {
          name = prefix + name;
        }

        if(!ext) {
          name += ".liquid";
        }

        filePath = path.join(includeBase, name);

      } else {
        filePath = name;
      }


      fs.readFile(filePath, 'utf8', function (err, text) {

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
      resolve(context.getBuffer(), template);
    });
  });

};

function isAbsolute(p) {
    if(path.isAbsolute) return path.isAbsolute(p);
    return path.normalize(p + '/') === path.normalize(path.resolve(p) + '/');
}

module.exports = liquify;