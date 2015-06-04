/* eslint-env node */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const fs = require('fs');
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const esperanto = require('esperanto');
const source = require('vinyl-source-stream');
const karma = require('karma').server;

// Lint

const dist = 'dist';
const index = 'index.js';
const lib = 'playbyplay.js';
const libName = 'playbyplay';

gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', 'test/tests/**/*.js', '*.js', 'test/*.js'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError())
        .pipe($.jscs());
});

// Build

gulp.task('clean', function(cb) {
    del([dist, 'test/coverage'], cb);
});

gulp.task('build', ['lint', 'clean'], function(done) {
    esperanto.bundle({
        base: 'src',
        entry: index
    }).then(function(bundle) {
        var res = bundle.toUmd({
            strict: true,
            sourceMap: true,
            sourceMapSource: index,
            sourceMapFile: lib,
            name: libName
        });

        // Write generated sourcemap.
        mkdirp.sync(dist);
        fs.writeFileSync(path.join(dist, lib), res.map.toString());

        $.file(lib, res.code, {src: true})
            .pipe($.sourcemaps.init({loadMaps: true }))
            .pipe($.babel({blacklist: ['useStrict'] }))
            .pipe($.sourcemaps.write('./', {addComment: false}))
            .pipe(gulp.dest(dist))
            .pipe($.filter(['*', '!**/*.js.map']))
            .pipe($.rename(path.basename(lib, '.js') + '.min.js'))
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.uglify())
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(dist))
            .on('end', done);
    })
    .catch(done);
});

// Test

gulp.task('test', ['build'], function(done) {
    karma.start({
        configFile: path.join(__dirname, '/test/karma.conf.js'),
        singleRun: true
    }, done);
});
