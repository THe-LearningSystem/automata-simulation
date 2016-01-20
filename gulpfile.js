var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    wiredep = require('wiredep'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    mainBowerFiles = require('gulp-main-bower-files'),
    concat = require('gulp-concat'),
    fileSort = require('gulp-angular-filesort'),
    useref = require('gulp-useref');

var paths = {
  js: 'app/js/**/*.js',
  views: 'app/view*/*.html',
  sass: 'app/styles/**/*scss',
  css: 'app/styles/**/*.css',
  images: 'app/images/**/*',
  dist: './dist',
  index: './app/index.html',
  all: './app/**/*.*'
}

var pipes = {};
pipes.uglifyAndConcat = function(){
  return
}
///////////////////////////
// Bootstrap SASS
////////////////////////////

gulp.task('sass', function(){
    gulp.src('app/styles/bootstrap.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/styles'));
    gulp.src('app/styles/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/styles'));

});

///////////////////////////
// Get, uglify and copy application js
////////////////////////////

gulp.task('assets', function(){
  var assets = useref.assets({noconcat: true});

  gulp.src(paths.index)
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest(paths.dist))
});

/////////////////////////////////////////////////
// Copy dependencys of index.html
/////////////////////////////////////////////////

gulp.task('wiredep-js', function(){
  console.log(wiredep().js);
  gulp.src(wiredep().js)
    .pipe(fileSort())
    .pipe(gulp.dest(paths.dist+'/scripts/vendor'));
});

gulp.task('wiredep-css', function() {
  gulp.src(wiredep().css)
    .pipe(gulp.dest(paths.dist+'/vendor'));
});

////////////////////////////////////////////////
// Copy html templates
////////////////////////////////////////////////

gulp.task('views', function(){
  gulp.src(paths.views)
    .pipe(gulp.dest(paths.dist+'/views'))
});

////////////////////////////////////////////////
// Copy images
////////////////////////////////////////////////

gulp.task('images', function(){
  gulp.src(paths.images)
    .pipe(gulp.dest(paths.dist+'/images'))
});

////////////////////////////////
// Copy fonts
////////////////////////////////
gulp.task('fonts', function(){
  gulp.src(paths.fonts)
  .pipe(gulp.dest(paths.dist+'/fonts'))

  gulp.src(paths.vendorFonts)
  .pipe(gulp.dest(paths.dist+'/vendor'))
});


////////////////////////////////////////////////
// Wiredep index.html
////////////////////////////////////////////////

gulp.task('index', function(){
  gulp.src(paths.index)
    .pipe(wiredep.stream({
      fileTypes: {
        html: {
          replace: {
            js: function(filePath){
              return '<script src="' + 'scripts/vendor/' + filePath.split('/').pop() + '"></script>';
            },
            css: function(filePath){
              return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
            }
          }
        }
      }
    }))
    .pipe(gulp.dest(paths.dist))
});

//////////////////////////////////
// Dev liveload
//////////////////////////////////
gulp.task('live', function(){
  connect.server({
    port: 9000,
    livereload: true,
  });
    gulp.watch(paths.sass,['sass']);
  gulp.watch(paths.all, function(obj) {
    if (obj.type === 'changed') {
      console.log(obj.path+' changed');
      gulp.src(obj.path, {base: './app/'})
      .pipe(connect.reload());
    }
  });
    
});

gulp.task('liveDist', function(){
  connect.server({
    port: 9000,
    livereload: true,
    root: './dist',
    middleware: function() {
      return [
        modRewrite([
          '^/api/v1/(.*)$ http://localhost:3000/api/v1/$1 [P]'
        ])
      ];
    }
  });
});

//////////////////////////////////
// Watcher
/////////////////////////////////
gulp.task('watch', function(){
  livereload.listen({
    port: 3000,
    basePath: 'app'
  });
});

/////////////////////////////////////////////////
//  Development Task
/////////////////////////////////////////////////
//gulp.task('dev', ['setupDev', 'scripts', 'html',  'fonts', 'bower', 'watch'])

gulp.task('build', ['wiredep-js', 'wiredep-css', 'assets', 'views', 'images', 'fonts', 'index']);
