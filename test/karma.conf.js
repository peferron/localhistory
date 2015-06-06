// jscs:disable requirePaddingNewLinesAfterBlocks

module.exports = function(config) {
    config.set({
        basePath: '../',
        files: [
            'dist_dev/playbyplay.js',
            'test/tests/**/*.js'
        ],
        frameworks: ['chai', 'mocha'],
        reporters: ['progress', 'coverage'],
        browsers: ['PhantomJS'],
        preprocessors: {
            'dist_dev/playbyplay.js': ['coverage'],
            'test/tests/**/*.js': ['babel']
        },
        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            filename: function(file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function(file) {
                return file.originalPath;
            }
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        }
    });
};
