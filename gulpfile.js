var gulp = require('gulp')
var stylus = require('gulp-stylus')
var cleancss = require('gulp-clean-css')
var autoprefixer = require('autoprefixer-stylus')
var concat = require('gulp-concat')
// var babel = require('gulp-babel')
var rollup = require('gulp-rollup')
var babel = require('rollup-plugin-babel')
var resolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')

var sourcemaps = require('gulp-sourcemaps')
var rollupsourcemaps = require('rollup-plugin-sourcemaps')
var uglify = require('gulp-uglify')

var server = require('gulp-ss-server')

gulp.task('style', function () {
  gulp
    .src(['src/styles/index.styl'])
    .pipe(stylus({
      use: [autoprefixer({
        browsers: [
          'last 2 versions', 'ie 9'
        ],
        cascade: false
      })]
    }))
    // .pipe(cleancss())
    .pipe(gulp.dest('build/styles/'))
})

gulp.task('assets', function () {
  gulp.src('src/styles/images/*.*')
    .pipe(gulp.dest('build/styles/images'))
})

gulp.task('script', function () {
  gulp
    .src(['src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(rollup({
      sourceMap: true,
      entry: './src/index.js',
      format: 'umd',
      moduleName: 'ContextMenu',
      plugins: [
        resolve({
          jsnext: true,
          main: true,
          browser: true
        }),
        commonjs(),
        babel({
          exclude: ['node_modules/**', 'bower_components/**']
        }),
        rollupsourcemaps()
      ]
    }))
    .pipe(concat('index.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('build/'))
})

gulp.task('dev', function () {
  gulp.run('script', 'style', 'assets')
  gulp.watch(['src/styles/index.styl'], function () {
    gulp.run('style')
  })
  gulp.watch(['src/**/*.js'], function () {
    gulp.run('script')
  })

  server.run({
    port: 3000
  })
})
