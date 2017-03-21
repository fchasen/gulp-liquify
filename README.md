Gulp Liquify
==============

A Liquid template render using [TinyLiquid](https://github.com/leizongmin/tinyliquid/)

Installation
------

```bash
$ npm install gulp-liquify
```

Usage
------

```js
var liquify = require('gulp-liquify');

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
You can pass file specific locals through the `gulp-data` plugin.

```js
var liquify = require('gulp-liquify');
var data = require('gulp-data');

gulp.task("liquify", function() {
  var locals = {
    name: "Fred"
  };
  gulp.src('*.liquid')
    .pipe(data(function(file) {
      return {
        number: Math.random(),
        path: file.path
      };
    }))
    .pipe(liquify(locals))
    .pipe(gulp.dest('./dist/'))
});
```

Liquid support from [tinyliquid](https://github.com/leizongmin/tinyliquid)
------

TinyLiquid does not support the locals variables like this: 
`a[0]`, `a["b"]`, `a[0]["b"]` and so on.

Only support to use `.` as the separator: `a.b`, `a.b.c`
