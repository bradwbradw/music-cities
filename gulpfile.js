const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// Static server


// Static Server + watching scss/html files

gulp.task('serve:music-cities', ['sass:music-cities'], function () {

  browserSync.init({
    server: "./sites/music-cities",
    middleware: [
//      require('connect-history-api-fallback')()
    ],
    ghostMode:{
      scroll:false,
      clicks:false,
      forms: false
    }
    //proxy:'localhost',
    //port: 3000
  });

  gulp.watch("sites/music-cities/**/*.scss", ['sass:music-cities']);
  gulp.watch("sites/music-cities/**/*.html").on('change', browserSync.reload);
  gulp.watch("sites/music-cities/**/*.js").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass:music-cities', function () {
  return gulp.src("sites/music-cities/style/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("sites/music-cities"))
    .pipe(browserSync.stream());
});

gulp.task('music-cities', ['serve:music-cities']);

gulp.task('default', ['music-cities']);