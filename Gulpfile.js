var
// Libs, very important stuff
  gulp       = require('gulp'),
  gutil      = require('gulp-util'),
  jade       = require('gulp-jade'),
  clean      = require('gulp-clean'),
  stylus     = require('gulp-stylus'),
  uglify     = require('gulp-uglify'),
  livereload = require('gulp-livereload'),
  browserify = require('gulp-browserify'),
  nodemon    = require('gulp-nodemon'),
  jshint     = require('gulp-jshint'),
  stylish    = require('jshint-stylish'),

// Our paths, to make easier getting with our files
  paths = {
    main    : 'server.js',
    server  : 'server/**/*',
    client  : {
      assets    : 'app/assets/**/*',
      mainStyle : 'app/styles/style.styl',
      scripts   : 'app/js/**/*.js',
      styles    : 'app/styles/**/*.styl',
      vendors   : 'app/vendor/**/*',
      views     : 'app/views/**/*.jade'
    },
    build   : {
      base     : 'build',
      assets   : 'build/assets',
      scripts  : 'build/js',
      styles   : 'build/css',
      vendors  : 'build/vendor'
    }
  };

// Gulp's "internal" tasks definition
gulp.task('jade', function() {
  return gulp.src(paths.client.views)
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.client.scripts)
    .pipe(browserify({
      basedir: 'build/js/',
      debug  : !gutil.env.development
    }))
    .pipe(gulp.dest(paths.build.scripts));
});

gulp.task('scripts-uglified', function() {
  return gulp.src(paths.client.scripts)
    .pipe(uglify({ outSourceMap: true }))
    .pipe(browserify({
      basedir: 'build/js/',
      debug  : !gutil.env.staging
    }))
    .pipe(gulp.dest(paths.build.scripts));
});

gulp.task('lint', function() {
  return gulp.src(paths.client.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('stylus', function() {
  return gulp.src(paths.client.mainStyle)
    .pipe(stylus({ pretty: true }))
    .pipe(gulp.dest(paths.build.styles));
});

gulp.task('assets', function() {
  return gulp.src(paths.client.assets)
    .pipe(gulp.dest(paths.build.assets));
});

gulp.task('vendor', function() {
  return gulp.src(paths.client.vendors)
    .pipe(gulp.dest(paths.build.vendors));
});

gulp.task('serve', ['build'], function() {
  return nodemon({ script: paths.main });
});

gulp.task('clean', function() {
  gulp.src('build', { read: false })
    .pipe(clean());
});

// Here goes our important tasks... our "macros"
gulp.task('build', ['lint', 'stylus', 'jade', 'scripts', 'assets', 'vendor']);
gulp.task('dev', ['build', 'serve', 'watch']);
gulp.task('default', ['build']);

// Watcher
gulp.task('watch', ['serve'], function() {
  var all_built_files = paths.build.base + '/**/*';
  gulp.watch(paths.client.assets, ['assets']);
  gulp.watch(paths.client.views, ['jade']);
  gulp.watch(paths.client.scripts, ['lint', 'scripts']);
  gulp.watch(paths.client.styles, ['stylus']);
  livereload.listen();
  return gulp.watch([all_built_files, paths.server, paths.main])
    .on('change', livereload.changed);
});
