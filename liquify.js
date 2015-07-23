var fs = require("fs");
var Promise = require("bluebird");
var tinyliquid = require("tinyliquid");

var liquify = function(contents, locals, includeBase){
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
      var absolute = (name[0] == "." || name[0] == "/");
      var path = absolute ? name : (includeBase || ".") + "/" + name;
      fs.readFile(path, 'utf8', function (err, text) {

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

module.exports = liquify;