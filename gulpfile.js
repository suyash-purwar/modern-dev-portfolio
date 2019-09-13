const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat")
const merge = require("merge-stream")
const rename = require("gulp-rename")
const minifycss = require("gulp-clean-css")

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

// Copy all HTML files
const copyHTML = () => {
    return gulp.src("src/index.html")
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream());
}

// Compile Sass
const manageStyles = () => {
    const css_paths = [
        'node_modules/slick-carousel/slick/slick-theme.css',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/aos/dist/aos.css'
    ]

    const sass_stream = gulp.src("src/sass/main.sass")
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))

    const css_stream = gulp.src(css_paths)
        .pipe(minifycss())

    return merge(sass_stream, css_stream)
        .pipe(concat("style.min.css"))
        .pipe(gulp.dest("dist/css"))
}

// Bundle Third Party JavaScript
const bundleThirdPartyJS = () => {
    js_paths = [
        "node_modules/slick-carousel/slick/slick.min.js",
        "node_modules/aos/dist/aos.js",
        "node_modules/smooth-scroll/dist/smooth-scroll.min.js"
    ]

    const slick = gulp.src(js_paths[0])
    const aos = gulp.src(js_paths[1])
    const scroll = gulp.src(js_paths[2])

    return merge(aos, slick, scroll)
        .pipe(concat("bundle.min.js"))
        .pipe(gulp.dest("dist/js"))
}

// Bundle Index JS
const bundleIndexJS = () => {
    return gulp.src("src/js/index.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('src/sass/**/*.sass', manageStyles);
    gulp.watch('src/images/*', imageMin);
    gulp.watch('src/images/icons/*', iconMin);
    gulp.watch('src/*.html', copyHTML);
    gulp.watch('src/js/*.js', bundleThirdPartyJS);
    gulp.watch('src/js/*.js', bundleIndexJS);
}

exports.watch = watch