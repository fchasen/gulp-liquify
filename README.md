Gulp Liquify
==============

A Liquid template render using ![TinyLiquid](https://github.com/leizongmin/tinyliquid/)

Installation
============

```bash
$ npm install gulp-liquify
```

Gulp Usage
=============

```js
var concat = require('gulp-liquify');

gulp.task("liquify", function() {
  var locals = {
    name: "Fred"
  };
  gulp.src('*.liquid')
    .pipe(liquify(locals))
    .pipe(gulp.dest('./dist/'))
});
```

You can pass a base for other templates to be included in a template. It defaults to the file base.

```js
  gulp.src('*.liquid')
    .pipe(liquify(locals, { base: "../templates/" }))
});
```
You can pass file specific locals by attaching it to the vinyl file object in a previous task.

```js
var concat = require('gulp-liquify');

gulp.task("liquify", function() {
  var locals = {
    name: "Fred"
  };
  gulp.src('*.liquid')
    .pipe(function(){
      // creating a stream through which each file will pass
      var stream = through.obj(function(file, enc, cb) {
        file.locals = {
          number: Math.random(),
          path: file.path
        };
      });
      
      // returning the file stream
      return stream;
    })
    .pipe(liquify(locals))
    .pipe(gulp.dest('./dist/'))
});

Liquid support
==============

TinyLiquid not support the locals variables like this: `a[0]`, `a["b"]`, `a[0]["b"]` and so on.

Only support to use `.` as the separator: `a.b`, `a.b.c`