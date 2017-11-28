var browserSync = require("browser-sync"),
    gulp        = require("gulp");

//start server
gulp.task('start-server', function(){
  browserSync({
      server: {baseDir: 'app'},
      notify: true
  });
});


//main watch command
gulp.task('default', ['start-server'], function(){
    gulp.watch('app/**/*.css', browserSync.reload);
});