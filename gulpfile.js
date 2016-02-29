var gulp          = require('gulp');
var minifycss     = require('gulp-minify-css');
var stylus        = require('gulp-stylus');
var autoprefixer  = require('gulp-autoprefixer');
var notify        = require('gulp-notify');
var livereload    = require('gulp-livereload');
var coffee        = require('gulp-coffee');
var changed       = require('gulp-changed');
var jade          = require('gulp-jade');
var watch         = require('gulp-jade');
var coffeelint    = require('gulp-coffeelint');
var plumber       = require('gulp-plumber');
var karma         = require('gulp-karma');
var wait          = require('gulp-wait');
var browserify    = require('gulp-browserify');
var rename        = require('gulp-rename');
var gutil         = require('gulp-util');
var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');
var rjs           = require('gulp-requirejs');
var opt           = require('amd-optimize');
var minifyHTML    = require('gulp-minify-html');

var devFolder   = '';
var distFolder  = '';
var jadeDelay = 1000;

//used to assign each build a unique identifier, and thus bust the cache on every release
var randomBuildNum = Math.round((Math.random()*1000000)%1000000);

var testFiles = [
      'spec/**/*.js'
    ];
var examplesFolder = 'page-examples/*.jade';
var paths = {
  src: {
    js:       devFolder + 'js/**/*.coffee',
    css:      devFolder + 'css/**/*.styl',
    cssRest:  devFolder + 'css-rest/**/*.styl',
    kit:      devFolder + 'css/kit.jade',
    kitRest:  devFolder + 'css-rest/kit.jade',
    index:    devFolder + 'index.jade',
    partials: devFolder + 'css/partials/**/*.jade',
    partialsRest: devFolder + 'css-rest/partials/**/*.jade',
    templates:devFolder + 'templates/**/*.jade',
    asyncTemplates: devFolder + 'async-templates/**/*.jade',
    tests:    distFolder + 'spec/**/*.coffee'
  },
  dist:{
    js:       distFolder + 'js/',
    tests:    distFolder + 'spec/',
    css:      distFolder + 'css/',
    cssRest:  distFolder + 'css-rest/',
    kit:      distFolder + 'css/',
    kitRest:  distFolder + 'css-rest/',
    index:    distFolder
  }
}

//used to generate optimized js for my-reports related javascript handlers
gulp.task('my-reports-js', function(){
  return rjs({
      baseUrl:  'js/',
      name:     'accountMain',
      out:      '../js-build/accountMain.dist.'+randomBuildNum+'.js',
      buildCSS: false,
      findNestedDependencies: true,
      stubModules : ['text'],
      mainConfigFile: "js/require.config.js"
    })
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
});

gulp.task('html', function(){
  var opts = {comments:true,spare:true};

  gulp.src('index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(''))
});


gulp.task('build', ['js']);

gulp.task('stylus', function(){
  return gulp.src(devFolder + 'css/main.styl')
          .pipe(stylus())
          .pipe(autoprefixer('last 4 version'))
          .pipe(minifycss({noAdvanced:true}))
          .pipe(gulp.dest(paths.dist.css))
          .pipe(livereload())
});

gulp.task('stylus-rest', function(){
  return gulp.src(devFolder + 'css-rest/main.styl')
          .pipe(stylus())
          .pipe(autoprefixer('last 4 version'))
          .pipe(minifycss({noAdvanced:true}))
          .pipe(gulp.dest(paths.dist.cssRest))
          .pipe(livereload())
});


gulp.task('coffee', function(e){
  return gulp.src(paths.src.js)
          .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
          .pipe(changed(paths.dist.js, { extension: '.js'} ))
          .pipe(coffeelint())
          .pipe(coffeelint.reporter())
          .pipe(coffeelint.reporter('fail'))
          .pipe(coffee({bare: true}))
          .pipe(gulp.dest(paths.dist.js))
          .pipe(livereload())
});

gulp.task('coffee:tests', function(e){
  return gulp.src(paths.src.tests)
          .pipe(plumber())
          .pipe(changed(paths.src.tests))
          .pipe(coffeelint())
          .pipe(coffeelint.reporter())
          .pipe(coffee())
          .pipe(gulp.dest(paths.dist.tests))
          .pipe(livereload())
});

gulp.task('kit:jade', function(e){
  return gulp.src(paths.src.kit)
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.dist.kit))
          .pipe(livereload())
});

gulp.task('kit-rest:jade', function(e){
  return gulp.src(paths.src.kitRest)
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.dist.kitRest))
          .pipe(livereload())
});

gulp.task('async-templates:jade', function(e){
  return gulp.src(paths.src.asyncTemplates)
          .pipe(changed(paths.src.asyncTemplates, { extension: '.html'} ))
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.src.asyncTemplates.replace('**/*.jade', '')))
          .pipe(livereload())
});

gulp.task('index:jade', function(e){
  return gulp.src(paths.src.index)
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.dist.index))
          // .pipe(wait(jadeDelay))
          .pipe(livereload())
});

gulp.task('examples:jade', function(e){
  return gulp.src(examplesFolder)
          .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest('page-examples/'))
          // .pipe(wait(jadeDelay))
          .pipe(livereload())
});

gulp.task('default', function(){
  var server = livereload.listen();

  gulp.watch(paths.src.css,     ['stylus']);
  gulp.watch(paths.src.cssRest, ['stylus-rest']);
  gulp.watch(paths.src.js, ['coffee']);
  gulp.watch(paths.src.kit,     ['kit:jade']);
  gulp.watch(paths.src.kitRest, ['kit-rest:jade']);
  gulp.watch(paths.src.index, ['index:jade']);
  gulp.watch(paths.src.asyncTemplates, ['async-templates:jade']);
  gulp.watch(paths.src.partials,     ['index:jade']);
  gulp.watch(paths.src.partialsRest, ['index:jade']);
  gulp.watch(paths.src.templates, ['index:jade']);
  gulp.watch(examplesFolder, ['examples:jade']);

});











