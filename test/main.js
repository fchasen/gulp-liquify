var assert = require('assert');
var should = require('should');

var gulp = require('gulp');
var util = require('gulp-util');

var liquify = require('../');

var path = require('path');
var fixtures = function (glob) { return path.join(__dirname, 'fixtures', glob); }

describe('gulp-liquify', function() {
  
  describe('in streaming mode', function() {
  
    it('should emit error on streamed file', function (done) {
      gulp.src(fixtures("*.liquid"), { buffer: false })
        .pipe(liquify({}))
        .on('error', function (err) {
          err.message.should.eql('Streaming not supported');
          done();
        });
    });
    
  });
  
  describe('in buffer mode', function() {
  
    it('renders a simple liquid template', function (done) {
      gulp.src(fixtures("test.liquid"))
        .pipe(liquify({ 
          name: "Fred"
        }))
        .on('data', function (data) {
          var content = data.contents.toString();

          content.should.equal('Hi, my name is Fred.');

          done();
        });
    });
    
    it('includes other liquid templates', function (done) {
      gulp.src(fixtures("include.liquid"))
        .pipe(liquify({ 
          name: "Fred"
        }))
        .on('data', function (data) {
          var content = data.contents.toString();

          content.should.equal('<p>Hi, my name is Fred.<p>');
    
          done();
        });
    });
    
    it('includes passed file.locals', function (done) {
      var through = require("through2");

      var locals = {
        name: "Fred"
      };
      
      gulp.src(fixtures("passed.liquid"))
        .pipe(through.obj(function(file, enc, cb) {
          file.locals = {
            name: "Derf"
          };
          cb(null, file);
        }))
        .pipe(liquify(locals))
        .on('data', function (data) {
          var content = data.contents.toString();
        
          content.should.equal('Hi, my name is Derf.');
        
          done();
        });
    
    });
    
  });
  
});

