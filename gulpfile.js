var gulp = require('gulp');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');

gulp.task('test', function() {
	
});


var tsProject = ts.createProject('./tsconfig.json');
gulp.task('typescript', function () {
    var tsResult = tsProject
        .src()
        .pipe(ts(tsProject));

    return tsResult.js
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('.'));
});