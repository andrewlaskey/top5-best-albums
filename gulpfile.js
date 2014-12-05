var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var svgSprites = require('gulp-svg-sprites');

var paths = {
  sass: ['./src/css/sass/**/*.scss'],
  img: './src/images/',
  svg: './src/images/svg/',
  js: [
    './bower_components/angular-spotify/src/angular-spotify.js',
    './bower_components/d3/d3.js',
    './bower_components/nvd3/nv.d3.js',
    './bower_components/Chart.js/Chart.js',
    './bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
    './bower_components/tc-angular-chartjs/dist/tc-angular-chartjs.js',
    './src/js/app.js'
  ],
  moveFiles: [
    './src/fonts/*.*',
    './src/images/*.*',
    './src/views/*.*',
    './src/index.html',
    './src/js/build/scripts.min.js',
    './src/css/style.min.css'
  ]
};

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./src/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./src/css/'))
    .on('end', done);
});

gulp.task('scripts', function() {
  gulp.src(paths.js)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./src/js/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./src/js/build/'));
});

gulp.task('sprites', function() {
  return gulp.src(paths.svg + '*.svg')
            .pipe(svg({
              defs: true,
              className: '.svg-%f-icon'
            }))
            .pipe(gulp.dest(paths.img));
});

gulp.task('reload', function() {
  gulp.src('./src/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['scripts']);
  gulp.watch([
    './src/*.html',
    './src/css/*.css',
    './src/js/*.js'
    ], ['reload']);
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('move', function() {
  gulp.src(paths.moveFiles, { base: './src/' })
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['connect', 'watch']);

gulp.task('deploy', ['move']);