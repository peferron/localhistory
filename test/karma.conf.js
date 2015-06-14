module.exports = function(config) {
    config.set({
        basePath: '../',
        files: [
            'node_modules/babel-core/browser-polyfill.js',
            'dist_dev/localhistory.js',
            'test/tests/**/*.js'
        ],
        frameworks: ['mocha', 'chai-as-promised', 'chai'],
        reporters: ['progress', 'coverage'],
        browsers: ['PhantomJS'],
        preprocessors: {
            'dist_dev/localhistory.js': ['coverage'],
            'test/tests/**/*.js': ['babel']
        },
        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
                optional: ['es7.asyncFunctions']
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
