var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var childProcess = require('child_process');
var del = require('del');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var tsd = require('tsd');
var ts = require('gulp-typescript');

var packageJson = require('./package.json');
var ng = require('./tools/build/ng');

var spawn = childProcess.spawn;
var server;

var PATHS = {
  lib: [
    'node_modules/traceur/bin/traceur-runtime.js',
    '!node_modules/systemjs/dist/*.src.js',
    'node_modules/systemjs/dist/*.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/zone.js/dist/long-stack-trace-zone.js',
    'node_modules/rx/dist/rx.js'
  ],
  typings: [
    'typings/tsd.d.ts'
  ],
  client: {
    ts: ['client/**/*.ts'],
    html: 'client/**/*.html',
    css: 'client/**/*.css',
    static: 'client/**/*.{svg,jpg,png,ico}'
  },
  dist: 'dist',
  distClient: 'dist/client',
  distLib: 'dist/lib',
  port: 8080
};

var ng2play = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

gulp.task('clean', function(done) {
  del([PATHS.dist], done);
});

gulp.task('tsd', function() {
  var tsdAPI = tsd.getAPI('tsd.json');
  return tsdAPI.readConfig({}, true).then(function() {
    return tsdAPI.reinstall(
      tsd.Options.fromJSON({}) // https://github.com/DefinitelyTyped/tsd/blob/bb2dc91ad64f159298657805154259f9e68ea8a6/src/tsd/Options.ts
    ).then(function() {
      return tsdAPI.updateBundle(tsdAPI.context.config.bundle, true);
    });
  });
});

gulp.task('angular2', function() {
  return ng.build(
    [
      '!node_modules/angular2/es6/prod/angular2_sfx.js',
      '!node_modules/angular2/es6/prod/angular2.api.js',
      '!node_modules/angular2/es6/prod/es5build.js',
      'node_modules/angular2/es6/prod/**/*.js'
    ],
    PATHS.distLib + '/angular2', {
      namespace: 'angular2',
      traceurOptions: {}
    }
  );
});

gulp.task('libs', ['tsd', 'angular2'], function() {
  return gulp
    .src(PATHS.lib)
    .pipe(rename(function(file) {
      file.basename = file.basename.toLowerCase(); // Firebase is case sensitive, thus we lowercase all for ease of access
    }))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(PATHS.distLib));
});

gulp.task('ts', function() {
  return gulp
    .src([].concat(PATHS.typings, PATHS.client.ts)) // instead of gulp.src(...), project.src() can be used
    .pipe(changed(PATHS.distClient, {
      extension: '.js'
    }))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(ts(ng2play))
    .js
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(PATHS.distClient));
});

gulp.task('html', function() {
  return gulp
    .src(PATHS.client.html)
    .pipe(changed(PATHS.distClient))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(PATHS.distClient));
});

gulp.task('css', function() {
  return gulp
    .src(PATHS.client.css)
    .pipe(changed(PATHS.distClient, {
      extension: '.css'
    }))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(PATHS.distClient));
});

gulp.task('static', function() {
  return gulp
    .src(PATHS.client.static)
    .pipe(changed(PATHS.distClient))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(PATHS.distClient));
});

gulp.task('bundle', function(done) {
  runSequence('clean', 'libs', ['ts', 'html', 'css', 'static'], done);
});

gulp.task('server:restart', function(done) {
  var started = false;
  if (server) {
    server.kill();
  }
  server = spawn('node', [packageJson.main]);
  server.stdout.on('data', function(data) {
    console.log(data.toString());
    if (started === false) {
      started = true;
      done();
    }
  });
  server.stderr.on('data', function(data) {
    console.error(data.toString());
  });
});

// clean up if an error goes unhandled.
process.on('exit', function() {
  if (server) {
    server.kill();
  }
});

gulp.task('play', ['bundle', 'server:restart'], function() {
  gulp.watch(PATHS.client.ts, ['ts']);
  gulp.watch(PATHS.client.html, ['html']);
  gulp.watch(PATHS.client.css, ['css']);
  gulp.watch(PATHS.client.static, ['static']);
  gulp.watch(packageJson.main, ['server:restart']);
});

gulp.task('default', ['bundle']);
