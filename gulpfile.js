var gulp = require('gulp');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var tslint = require("gulp-tslint");
var merge = require('merge2');
var del = require('del');

gulp.task('clean', function() {
    return del([
        'src/**/*.js',
        'src/**/*.d.ts',
        'tests/**/*.js',
        'tests/**/*.d.ts',
    ]);
})

gulp.task('test', function() {
	return gulp.src('tests/**/*.js', {read: false})
        .pipe(mocha());
});

gulp.task('tslint', gulp.series('clean', function() {
    return gulp.src(["src/**.ts", "tests/**.ts", "index.ts"])
        .pipe(tslint())
        .pipe(tslint.report("verbose"))
}));

var tsProject = ts.createProject('./tsconfig.json');
gulp.task('typescript', gulp.series('tslint', function () {
    var tsResult = tsProject
        .src()
        .pipe(tsProject());

    return merge([
        tsResult.js.pipe(gulp.dest('.')),
        tsResult.dts.pipe(gulp.dest('.'))
    ]);
}));

gulp.task('watch', gulp.series('typescript', function() {
    return gulp.watch('**/*.ts', gulp.series('typescript'));
}));