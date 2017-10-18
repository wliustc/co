var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var cssnano = require('gulp-cssnano');
var header = require('gulp-header');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
// css导出URL
const PROJECTURL = '../css/';
// less导出URL
const LESSURL = '../less/';
const NAME = '邮爱传万家，跨年大聚惠';
const CSSRULES = ['iOS >= 8', 'Android >= 4.1'];
// const CSSRULES = ['last 2 version','ie 8'];

gulp.task('less', function() {
    var banner = [
        '/*!',
        ' * @desctiption: ' + NAME,
        ' * @author  wushain',
        ' * @time: <%= new Date().getFullYear() %>/<%= new Date().getMonth()+1 %>/<%= new Date().getDate() %>',
        ' */',
        ''
    ].join('\n');
    return gulp.src('./src/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([autoprefixer(CSSRULES)]))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PROJECTURL));
    // .pipe(cssnano({
    //     zindex: false,
    //     autoprefixer: false
    // }))
    // .pipe(rename(function(path) {
    //     path.basename += '.min';
    // }))
    // .pipe(gulp.dest(PROJECTURL));
});

gulp.task('watch', ['less'], function() {
    gulp.watch("./src/*.less", ['less']);
});

gulp.task('build', function() {
    return gulp.src('./src/*.less')
        .pipe(gulp.dest(LESSURL))
});

gulp.task('release', ['build']);
