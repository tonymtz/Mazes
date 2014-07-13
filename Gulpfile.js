var
// Libs, very important stuff
  gulp = require('gulp'),
  jade = require('gulp-jade'),
  clean = require('gulp-clean'),
  stylus = require('gulp-stylus'),
  uglify = require('gulp-uglify'),
  livereload = require('gulp-livereload'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  spawn = require('child_process').spawn,
  node,

// Our paths, to make easier getting with our files
  paths = {
    assets: './app/assets/**/*.png', // png only, fck jpg!!
    libs: './lib/*.js',
    scripts: './app/js/**/*.js',
    server: './server/**/*.js',
    styles: './app/styles/**/*.styl',
    views: './app/views/**/*.jade'
  };

// Gulp's "internal" tasks definition
gulp.task('jade', function() {
  gulp.src(paths.views)
  .pipe(jade({
    pretty: true,
    basedir:'./app/views'
  }))
  .pipe(gulp.dest('./build'));
});

gulp.task('compress', function() {
  gulp.src(paths.libs)
    .pipe(uglify({outSourceMap: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(uglify({outSourceMap: true}))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('lint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('stylus', function () {
  gulp.src(paths.styles)
    .pipe(stylus())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('copy-assets', function() {
  gulp.src(paths.assets)
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['server/index.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('clean', function() {
  gulp.src('app/tmp', {read: false})
    .pipe(clean());
});

// Here goes our important tasks... our "macros"
gulp.task('build', ['stylus', 'jade', 'lint', 'scripts', 'copy-assets']);
gulp.task('default', ['server', 'build', 'watch']);

// Watcher
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.styles, ['stylus']).on('change', livereload.changed);
  gulp.watch(paths.views, ['jade']).on('change', livereload.changed);
  gulp.watch(paths.scripts, ['scripts']).on('change', livereload.changed);
  gulp.watch(paths.assets, ['copy-assets']).on('change', livereload.changed);
  gulp.watch(paths.server, ['server']);
});

// Clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
});
