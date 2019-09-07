const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const autoprefixer = require("gulp-autoprefixer");
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
        .pipe(gulp.dest("dist/images"))
        .pipe(browserSync.stream());
}

// Optimize Programming Iocns
const iconMin = () => {
    return gulp.src("src/images/icons/*")
        .pipe(imagemin([
            pngquant({ quality: [0.7, 0.7] }),
            mozjpeg({ quality: 70 })
        ]))
        .pipe(gulp.dest("dist/images/icons"))
        .pipe(browserSync.stream());
}

// Minify JavaScript
const minifyJS = () => {
    return gulp.src("src/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

// Copy all HTML files
const copyHTML = () => {
    return gulp.src("src/index.html")
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream());
}

// Compile Sass
const transpileSass = () => {
    return gulp.src("src/sass/main.sass")
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
}


function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('src/sass/**/*.sass', transpileSass);
    gulp.watch('src/images/*', imageMin);
    gulp.watch('src/images/icons/*', iconMin);
    gulp.watch('src/*.html', copyHTML);
    gulp.watch('src/js/*.js', minifyJS);
}

exports.watch = watch