/* eslint-env node */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const fs = require('fs');
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const esperanto = require('esperanto');
const karma = require('karma');

const js = ['src/**/*.js', 'test/tests/**/*.js', '*.js', 'test/*.js'];

// Lint

gulp.task('lint', function() {
    return gulp.src(js)
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError())
        .pipe($.jscs());
});

// Build

const dev = 'dist_dev';
const index = 'index.js';
const lib = 'playbyplay.js';
const exportedName = 'playbyplay';

gulp.task('clean', function(done) {
    del([dev, 'test/coverage'], done);
});

gulp.task('build', function(done) {
    esperanto.bundle({
        base: 'src',
        entry: index
    }).then(function(bundle) {
        const res = bundle.toUmd({
            strict: true,
            sourceMap: true,
            sourceMapSource: index,
            sourceMapFile: lib,
            name: exportedName
        });

        mkdirp.sync(dev);
        const map = path.join(dev, 'map.json');
        fs.writeFileSync(map, res.map.toString());

        $.file(map, res.code, {src: true})
            .pipe($.rename(lib))
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.babel({blacklist: ['useStrict']}))
            .pipe($.sourcemaps.write('./', {addComment: false, sourceRoot: './'}))
            .pipe(gulp.dest(dev))
            .pipe($.filter(['*', '!**/*.js.map']))
            .pipe($.rename(path.basename(lib, '.js') + '.min.js'))
            .pipe($.sourcemaps.init({loadMaps: true, sourceRoot: './'}))
            .pipe($.uglify())
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(dev))
            .on('end', function() {
                del(map, done);
            });
    })
    .catch(done);
});

// Test

const karmaConf = path.join(__dirname, '/test/karma.conf.js');

gulp.task('test', ['lint', 'build'], function(done) {
    karma.server.start({
        configFile: karmaConf,
        singleRun: true,
        autoWatch: false
    }, done);
});

gulp.task('watch', ['build'], function() {
    karma.server.start({
        configFile: karmaConf,
        singleRun: false,
        autoWatch: true,
        autoWatchBatchDelay: 500
    });

    gulp.watch(js, ['build']);
});
