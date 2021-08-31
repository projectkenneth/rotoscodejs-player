let { src, dest } = require('gulp');
let minify = require('gulp-minify');

exports.default = function () {
    return src('src/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true
        }))
        .pipe(dest('dist/'));
}