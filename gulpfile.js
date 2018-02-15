var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    notify      = require('gulp-notify'),
    sass        = require('gulp-sass'),
    less        = require('gulp-less'),
    path        = require('path'),
    cssmin      = require('gulp-cssmin'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    buffer      = require('vinyl-buffer'),
    concat      = require("gulp-concat"),
    gulpCopy    = require('gulp-copy'),
///////////////////////////////
    fs          = require('fs'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    babelify    = require('babelify'),
    rimraf      = require('rimraf'),
    source      = require('vinyl-source-stream'),
    _           = require('lodash'),
    reload      = browserSync.reload,

    change      = require('gulp-change'),
    fileinclude    = require('gulp-file-include');
//npm i --save-dev babel-core
    
gulp.task("start-server", () => {
  browserSync({
    server: {baseDir: "dist"},
    notify: true});
});

gulp.task("reload", () => {
  browserSync.reload({stream: true});
})

gulp.task('sass', () => {
  return gulp.src('app/sass/**/*+(.sass|.scss)')
      .pipe(sass().on("error", notify.onError()))
      .pipe(gulp.dest('app/less'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('less', ['sass'], () => {
  // return gulp.src('app/less/**/*.less')
  return gulp.src('app/less/styles.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }).on("error", notify.onError()))
    .pipe(rename({suffix: '.min'}))
    // .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task("default", ["less", 'build-all', "start-server"], () => {
  // gulp.watch('app/css/**/*.css', ['build-css', "reload"]);
  gulp.watch('app/less/**/*.less', ["less", 'build-css', "reload"]);
  gulp.watch('app/js/**/*.js', ['watch-js','build-js'/*, "reload"*/]);
  gulp.watch('app/**/*.html', ['build-html', browserSync.reload]);
  gulp.watch('app/libs/**/*', ['build-libs', "reload"]);
  gulp.watch('app/assets/**/*', ['build-imgs', "reload"]);

})


///build
gulp.task('build-html', function(){
  return gulp.src('app/template/index.html')
      .pipe(fileinclude({
          prefix: '@@',
          basepath: 'app/template'
      }))
      // .pipe(change((content) => {
      //   return content.replace(/type\=\"module\"/g, '');
      //   }))
      .pipe(gulp.dest('dist'))
});

gulp.task('build-css', function() {
  return gulp.src([
    'app/css/**/*.css',  
    // "app/libs/weather-icons/css/weather-icons.min.css", 
  ])
  .pipe(concat('styles.min.css'))
  .pipe(cssmin())
  .pipe(gulp.dest('dist/css/'))
});

gulp.task('build-libs', function() {
return gulp.src('app/libs/**/*')
    .pipe(gulpCopy('dist/', {prefix: 1}))
    .pipe(gulp.dest('dist/libs/'));
  });

gulp.task('build-imgs', function() {
  return gulp.src('app/assets/**/*')
      .pipe(gulpCopy('dist/', {prefix: 1}))
      .pipe(gulp.dest('dist/assets/'));
    });


gulp.task('build-all', ['build-imgs', 'build-libs', 'build-html', 'build-css', 'build-js'], () => {
  
});

////////=== transpile ==JS== modules to single js file  ===//////////
//https://github.com/thoughtram/es6-babel-browserify-boilerplate
var config = {
  entryFile: './app/js/app.js',
  outputDir: './dist/js',
  outputFile: 'app.js'
};
// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(buffer()) // convert from streaming to buffered vinyl file object
    .pipe(uglify()) // (required babelify@6.3.0) now gulp-uglify works 
    .pipe(gulp.dest(config.outputDir))
    .pipe(browserSync.reload({stream: true}));
}

gulp.task('build-persistent', ['clean'], function() {
  return bundle();
});
gulp.task('build-js', ['build-persistent'], function() {
  // process.exit(0);
});
gulp.task('watch-js', ['build-persistent'], function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
});

///////////////////////////////////////////



