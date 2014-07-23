
var path = require('path'),
    rootPath = path.join(__dirname, '..', '..', '..'),
    staticPath = path.join('monitor', 'static'),
    jsPath = path.join(staticPath, 'js'),
    testsPath = path.join(staticPath, 'tests');

module.exports = {
    'monitor tests': {
        environment: 'node',
        rootPath: rootPath,
        sources: [
            path.join(jsPath, 'sign-in.js')
        ],
        tests: [
            path.join(testsPath, '*-test.js')
        ]
    }
};

