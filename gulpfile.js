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

// Send favicons to dist
const sendFavicons = () => gulp.src("src/images/favicons/*")
    .pipe(gulp.dest("dist/images/favicons"))
    .pipe(browserSync.stream());

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

// Bundle Third Party JavaScript
const bundleThirdPartyJS = () => {
    js_paths = [
        "node_modules/siema/dist/siema.min.js",
        "node_modules/scroll-out/dist/scroll-out.min.js",
        "node_modules/smooth-scroll/dist/smooth-scroll.min.js"
    ]

    const slick = gulp.src(js_paths[0])
    const scroll_out = gulp.src(js_paths[1])
    const smooth_scroll = gulp.src(js_paths[2])

    return merge(scroll_out, slick, smooth_scroll)
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
    gulp.watch('src/images/favicons/*', sendFavicons);
    gulp.watch('src/*.html', copyHTML);
    gulp.watch('src/js/*.js', bundleThirdPartyJS);
    gulp.watch('src/js/*.js', bundleIndexJS);
}

exports.watch = watch