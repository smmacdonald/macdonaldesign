'use strict';

// Array of Javascript files to concatenate and minify
var js_concat = [
  './assets/packages/bootstrap/dist/js/bootstrap.bundle.min.js',
  './assets/packages/imagesloaded/imagesloaded.pkgd.min.js',
  './assets/packages/slick/slick/slick.min.js',
  './assets/packages/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
  './assets/packages/isotope/dist/isotope.pkgd.min.js',
  './assets/scripts/scripts.js'
];


//---------------------------------------------------------------------------------------------
// Load the dependencies
//---------------------------------------------------------------------------------------------
var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    postcss       = require('gulp-postcss'),
    uglify        = require('gulp-uglify'),
    rename        = require("gulp-rename"),
    autoprefixer  = require('autoprefixer'),
    concat        = require('gulp-concat'),
    runSequence   = require('gulp4-run-sequence');


//---------------------------------------------------------------------------------------------
// TASK: sass
//---------------------------------------------------------------------------------------------
gulp.task('sass', function () {
  return gulp.src('./assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css'));
});

//---------------------------------------------------------------------------------------------
// TASK: sass-deploy
//---------------------------------------------------------------------------------------------
gulp.task('sass-deploy', function () {
  return gulp.src('./assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compact',
      precision: 10
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css'));
});

//---------------------------------------------------------------------------------------------
// TASK: postcss
//---------------------------------------------------------------------------------------------
gulp.task('postcss', function () {
  return gulp.src('./assets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css'));
});

//---------------------------------------------------------------------------------------------
// TASK: scripts
//---------------------------------------------------------------------------------------------
gulp.task('scripts', function() {
  return gulp.src(js_concat)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./assets/js/concat'));
});

//---------------------------------------------------------------------------------------------
// TASK: uglify
//---------------------------------------------------------------------------------------------
gulp.task('uglify', function () {
  return gulp.src('./assets/js/concat/all.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(gulp.dest('./assets/js'));
});


//---------------------------------------------------------------------------------------------
// DEVELOPMENT/WATCH TASK: Run `gulp watch`
// This is the development task. It is the task you will primarily use. It will watch
// for changes in your sass files, and recompile new CSS when it sees changes. It
// will do the same for javascript files as well.
//---------------------------------------------------------------------------------------------
gulp.task('watch', function () {
  // SCSS
  gulp.watch('./assets/scss/*.scss', 
    function(callback){ runSequence('sass', 'postcss', callback)
  });
  // JS
  gulp.watch('./assets/scripts/*.js', 
    function(callback){ runSequence('scripts', 'uglify', callback)
  });
});

//---------------------------------------------------------------------------------------------
// PRODUCTION TASK: Run `gulp deploy`
// This is the production task, It will clean out all of the specified directories,
// compile and minify your sass, concatencate and minify your script.
//---------------------------------------------------------------------------------------------
gulp.task('deploy', 
  function(callback){ runSequence('sass-deploy', 'postcss', 'scripts', 'uglify', callback)
});
