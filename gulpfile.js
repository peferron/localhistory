/* eslint-env node */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const fs = require('fs');
const del = require('del');
const glob = require('glob');
const path = require('path');
const mkdirp = require('mkdirp');
const babelify = require('babelify');
const esperanto = require('esperanto');
const browserify = require('browserify');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');

const manifest = require('./package.json');
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));

// Remove built files.
gulp.task('clean', function(cb) {
    del([destinationFolder], cb);
});

// Remove temporary files.
gulp.task('clean-tmp', function(cb) {
    del(['tmp'], cb);
});

// Send a notification when JSRC fails, to know that changes didn't build.
function jscsNotify(file) {
    return file.jscs && file.jscs.success ? false : 'JSRC failed';
}

function createLintTask(taskName, files) {
    gulp.task(taskName, function() {
        return gulp.src(files)
            .pipe($.plumber())
            .pipe($.eslint())
            .pipe($.eslint.format())
            .pipe($.eslint.failOnError())
            .pipe($.jscs())
            .pipe($.notify(jscsNotify));
    });
}

// Lint source code.
createLintTask('lint-src', ['src/**/*.js']);

// Lint test code.
createLintTask('lint-test', ['test/**/*.js']);

// Build two versions of the library.
gulp.task('build', ['lint-src', 'clean'], function(done) {
    esperanto.bundle({
        base: 'src',
        entry: config.entryFileName
    }).then(function(bundle) {
        var res = bundle.toUmd({
            strict: true,
            sourceMap: true,
            sourceMapSource: config.entryFileName + '.js',
            sourceMapFile: exportFileName + '.js',
            name: config.exportVarName
        });

        // Write generated sourcemap.
        mkdirp.sync(destinationFolder);
        fs.writeFileSync(path.join(destinationFolder, exportFileName + '.js'), res.map.toString());

        $.file(exportFileName + '.js', res.code, {src: true})
            .pipe($.plumber())
            .pipe($.sourcemaps.init({loadMaps: true }))
            .pipe($.babel({blacklist: ['useStrict'] }))
            .pipe($.sourcemaps.write('./', {addComment: false}))
            .pipe(gulp.dest(destinationFolder))
            .pipe($.filter(['*', '!**/*.js.map']))
            .pipe($.rename(exportFileName + '.min.js'))
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.uglify())
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(destinationFolder))
            .on('end', done);
    })
    .catch(done);
});

// Bundle app for unit tests.
gulp.task('browserify', function() {
    var testFiles = glob.sync('./test/unit/**/*');
    var allFiles = ['./test/setup/browserify.js'].concat(testFiles);
    var bundler = browserify(allFiles);
    bundler.transform(babelify.configure({
        sourceMapRelative: path.join(__dirname, '/src'),
        blacklist: ['useStrict']
    }));
    return bundler.bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe($.plumber())
        .pipe(source('./tmp/__spec-build.js'))
        .pipe(gulp.dest(''))
        .pipe($.livereload());
});

function test() {
    return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
        .pipe($.mocha({reporter: 'dot', globals: config.mochaGlobals}));
}

// Lint and run tests.
gulp.task('test', ['lint-src', 'lint-test'], function() {
    require('babel/register');
    return test();
});

// Ensure that linting occurs before browserify runs. This prevents the build from breaking due to
// poorly formatted code.
gulp.task('build-in-sequence', function(callback) {
    runSequence(['lint-src', 'lint-test'], 'browserify', callback);
});

const watchFiles = ['src/**/*', 'test/**/*', 'package.json', '**/.eslintrc', '.jscsrc'];

// Run headless unit tests after each change.
gulp.task('watch', function() {
    runSequence(['test'], function() {
        gulp.watch(watchFiles, ['test']);
    });
});

// Set up livereload environment for spec runner.
gulp.task('test-browser', ['build-in-sequence'], function() {
    $.livereload.listen({port: 35729, host: 'localhost', start: true});
    return gulp.watch(watchFiles, ['build-in-sequence']);
});
