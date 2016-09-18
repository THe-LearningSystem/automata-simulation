// ===================================
// Required node modules
// ===================================
var gulp = require('gulp'),                      // use gulp
    sass = require('gulp-sass'),                 // compiles sass
    plumber = require('gulp-plumber'),              // prevent pipe breaking in gulp
    autoprefixer = require('gulp-autoprefixer'),         // autoprefixes css
    browserSync = require('browser-sync'),              // browser-sync ftw
    reload = browserSync.reload,                   // variable to reload the browser
    uglify = require('gulp-uglify'),               // uglifies Javascript
    minify = require('gulp-clean-css'),           // minifies CSS
    concat = require('gulp-concat'),               // concatenates files
    notify = require('gulp-notify');               // notifications for gulp tasks


// ===================================
// Sass task
// ===================================

gulp.task('sass', function () {
    gulp.src('app/styles/sass/style.scss')                      // Source: sass file that imports all others
        .pipe(plumber())                                        // Prevent pipe breaking if errors
        .pipe(sass())                                           // Compiles sass
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('app/styles/css'))
        .pipe(browserSync.reload({stream: true}));
});


// ===================================
// Browser-sync task
// ===================================

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "app/"
        },
    });
    gulp.watch("app/**/*.js").on('change', browserSync.reload);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
});

// ===================================
// Watch tasks
// ===================================

gulp.task('watch', function () {
    gulp.watch('app/styles/sass/*.scss', ['sass']);
});

// ===================================
// Default task
// ===================================

gulp.task('default', ['sass', 'browser-sync', 'watch']);