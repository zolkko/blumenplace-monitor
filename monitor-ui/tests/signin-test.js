var fs = require('fs'),
    path = require('path'),
    buster = require('buster'),
    SignIn = require('../js/sign-in'),
    assert = buster.referee.assert,
    refute = buster.referee.refute;

var createEvent = function (doc, type) {
    var e = document.createEvent('Event');
    e.initEvent(type, true, true);
    return e;
};

buster.testCase('Sign-In TestCase', {
    setUp: function () {
        var jsdom = require('jsdom').jsdom;
        GLOBAL.document = jsdom(fs.readFileSync(path.join(__dirname, 'fixtures', 'signin.fixture.html'), 'utf-8'));
        GLOBAL.window = document.parentWindow;

        this.app = new SignIn();
    },

    tearDown: function () {
        GLOBAL.window = null;
        GLOBAL.document = null;
    },

    'App constructor should initialize element references': function () {
        assert(this.app.$username);
        assert(this.app.$usernameField);
        assert(this.app.$password);
        assert(this.app.$passwordField);
        assert(this.app.$form);
    },

    'Username check does not allow empty strings': function () {
        this.app.$username.value = '     ';
        assert(!this.app.usernameCheck());
    },

    'Username check does not allow string shorter then 4 characters': function () {
        this.app.$username.value = '   123  ';
        assert(!this.app.usernameCheck());
    },

    'Username check should be longer then 3 characters': function () {
        this.app.$username.value = '  1234 ';
        assert(this.app.usernameCheck());
    },

    'Keypress removes error hint from username-field': function () {
        this.app.init();
        this.app.$usernameField.className = 'error';

        var e = createEvent(document, 'keypress');
        this.app.$username.dispatchEvent(e);

        assert.equals('', this.app.$usernameField.className);
    },

    'Keypress removes error hint from password-field': function () {
        this.app.init();
        this.app.$passwordField.className = 'original error';

        var e = createEvent(document, 'keypress');
        this.app.$password.dispatchEvent(e);

        assert.equals('original', this.app.$passwordField.className);
    },

    'Invalid input prevents form submission': function () {
        this.app.init();

        this.app.$username.value = ' 123 ';
        this.app.$password.value = ' 12345   ';

        var e = createEvent(document, 'submit');
        this.app.$form.dispatchEvent(e);

        assert(e._preventDefault, 'default should be true');
    },

    'Invalid form input results in error hints addition': function () {
        this.app.init();

        this.app.$username.value = ' 123 ';
        this.app.$usernameField.className = 'username';
        this.app.$password.value = ' 12345   ';
        this.app.$passwordField.className = 'password';

        assert(!this.app.onSubmit(null));
        assert.equals('username error', this.app.$usernameField.className);
        assert.equals('password error', this.app.$passwordField.className);
    }
});

