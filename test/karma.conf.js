// jscs:disable requirePaddingNewLinesAfterBlocks

module.exports = function(config) {
    config.set({
        basePath: '../',
        files: [
            'dist/playbyplay.js',
            'test/tests/**/*.js'
        ],
        autoWatch: true,
        frameworks: ['chai', 'mocha'],
        reporters: ['progress', 'coverage'],
        browsers: ['PhantomJS'],
        preprocessors: {
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
            reporters: [
                {type: 'lcov', dir: 'test/coverage'}
            ]
        }
    });
};
