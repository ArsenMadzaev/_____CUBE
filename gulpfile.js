const { src, dest, watch, parallel, series } = require('gulp');
// const sass = require('gulp-sass')(require('sass'));
// const sccs = require('gulp-sass')(require('sass'));
const sass = require('gulp-dart-sass');
const sccs = require('gulp-dart-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const cheerio = require('gulp-cheerio'); // Удаление лишних атрибутов из SVG
const svgSprite = require('gulp-svg-sprite');
const touch = require('gulp-touch-fd');
const replace = require('gulp-replace');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function clearDist() {
    return del('dist')
}

function scripts() {
    return src([
        // 'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(sourcemaps.write('./'))
    .pipe(sourcemaps.write('./'))
    .pipe(browserSync.stream())
}

function images() {
    return src('app/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(sccs({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function svgSprites() {
   return src('app/svg/*.svg')
        .pipe(cheerio({
            run: function ($) {
                // $('[fill]').removeAttr('fill');
                // $('[stroke]').removeAttr('stroke');
                // $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(svgSprite({
            mode: {
                svg: {
                    dimensionAttributes: true
                },
                symbol: {
                    sprite: './svg-symbols.svg',
                }
            },

        }))
        .pipe(replace('<?xml version="1.0" encoding="utf-8"?>', ''))
        .pipe(dest('app/svg'))
        .pipe(touch());
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

exports.svgSprites = svgSprites;
exports.styles = styles;
exports.watching = watching
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.clearDist = clearDist

exports.build = series(clearDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching, svgSprites); //svgSprites
