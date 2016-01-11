var gulp = require('gulp');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var tslint = require("gulp-tslint");
var merge = require('merge2');

gulp.task('test', ['typescript'], function() {
	return gulp.src('tests/**/*.js', {read: false})
        .pipe(mocha());
});


var tsProject = ts.createProject('./tsconfig.json');
gulp.task('typescript', ['tslint'], function () {
    var tsResult = tsProject
        .src()
        .pipe(ts(tsProject)); 

    return [
        tsResult.js.pipe(gulp.dest('.')),
        tsResult.dts.pipe(gulp.dest('.'))
        ];
});

gulp.task('tslint', function() {
    return gulp.src(["src/**.ts", "tests/**.ts", "index.ts"])
        .pipe(tslint())
        .pipe(tslint.report("verbose"))
});

gulp.task('watch', ['typescript'], function() {
    return gulp.watch('**/*.ts', ['typescript']);
});