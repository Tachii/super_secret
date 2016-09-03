var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    pug = require('gulp-pug'),
    nib = require('nib'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    notify = require("gulp-notify"),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    normal = require('normalize.stylus');


gulp.task('stylus', function () {
    gulp.src(['./resources/assets/stylus/*.styl'])
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: notify.onError(gutil.log())
        }))
        .pipe(stylus({
            use: nib(),
            compress: true,
            include: [
                normal.path
            ]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});


gulp.task('scripts', function () {
    gulp.src(['./resources/assets/scripts/*.js'])

        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError(gutil.log())}))
        .pipe(browserify())
        .pipe(babel({
            presets: ['es2016'],
            compact: true
        }))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/_entry/g, '.min');
            return path;
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'))
        .pipe(browserSync.stream());

});


gulp.task('images', function () {
    gulp.src('./resource/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))
        .pipe(browserSync.stream());
});


// Watcher
gulp.task('watcher', function () {
    gulp.watch("resources/assets/stylus/**/*.styl", ['stylus']);
    gulp.watch("resources/assets/scripts/**/*.js", ['scripts']);
    gulp.watch("resources/assets/images/**/*", ['images']);
});


gulp.task('fonts', function () {
    gulp.src('assets/fonts/**/*')
        .pipe(gulp.dest('./public/fonts/'))

});

// Gulp tasks to run
gulp.task('default', ['stylus', 'scripts', 'images', 'fonts']);