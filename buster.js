
module.exports = {
    'monitor tests': {
        environment: 'node',  // 'node' or 'browser'
        rootPath: './',
        sources: [
            'monitor/static/js/sign-in.js'
        ],
        tests: [
            'monitor/static/tests/*-test.js'
        ]
    }
};

