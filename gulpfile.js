var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');

// gulp.task('concat', function() {
// 	gulp.src(['./js/index.js'])
// 		.pipe(concat('min.index.js'))
// });

// process js files
gulp.task('js-file', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(babel())
		.pipe(concat('index.js'))
		.pipe(gulp.dest('dist/js'))
		// .pipe(uglify())
    	// .pipe(gulp.dest('dist/js'));
});

// watch js file, execute packing codes before reload
gulp.task('js-watch', ['js-file'], function(done) {
	browserSync.reload();
	done();
});


// process css files
gulp.task('css-file', function() {
	return gulp.src('src/css/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('css-watch', ['css-file'], function(done) {
	browserSync.reload();
	done();
});


// process html files
gulp.task('html-file', function() {
	return gulp.src('*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist/pages'));
});	

gulp.task('html-subpages-file', function() {
	return gulp.src('src/pages/*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist/pages'));
});	



gulp.task('html-watch', ['html-file'], function(done) {
	browserSync.reload();
	done();
});
gulp.task('html-subpages-watch', ['html-subpages-file'], function(done) {
	browserSync.reload();
	done();
});


// listen and watch
gulp.task("auto",function(){
	browserSync.init({
        server: {
        	baseDir: './'
        }
    });
    gulp.watch("src/js/**/*.js", ["js-watch"]);
    gulp.watch("src/css/*.css", ["css-watch"]);
    gulp.watch("*.html", ["html-watch"]);
    gulp.watch("src/pages/*.html", ["html-subpages-watch"]);
});

// default cmd
gulp.task('default', ['auto']);
