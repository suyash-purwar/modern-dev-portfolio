const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const browserSync = require("browser-sync").create();

// Logs Info
const info = () => {
    return console.log("Gulp is running!")
}

// Optimize Images
const imageMin = () => {
    return gulp.src("src/images/*")
        .pipe(imagemin([
            pngquant({ quality: [0.5, 0.5] }),
            mozjpeg({ quality: 50 })
        ]))
        .pipe(gulp.dest("dist/images"));
}

// Optimize Programming Iocns
const iconMin = () => {
    return gulp.src("src/images/icons/*")
        .pipe(imagemin([
            pngquant({ quality: [0.7, 0.7] }),
            mozjpeg({ quality: 70 })
        ]))
        .pipe(gulp.dest("dist/images/icons"));
}

// Minify JavaScript
const minifyJS = () => {
    return gulp.src("src/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

// Copy all HTML files
const copyHTML = () => {
    gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream());
}

// Compile Sass
const transpileSass = () => {
    return gulp.src("src/sass/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css/style.css'))
        .pipe(browserSync.stream());
}


function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('src/sass/*.scss', transpileSass);
    gulp.watch('src/images/*', imageMin);
    gulp.watch('src/images/icons/*', iconMin);
    gulp.watch('src/html/*.html', copyHTML);
    gulp.watch('src/js/*.js', minifyJS);
}

exports.watch = watch