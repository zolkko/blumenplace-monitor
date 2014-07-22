
module.exports = (function () {
    var App = function () {
        this.$username = document.getElementById('username');
        this.$password = document.getElementById('password');
        this.$usernameField = document.getElementById('username-field');
        this.$passwordField = document.getElementById('password-field');
        this.$form = document.querySelector('form');
    };

    App.prototype = {
        usernameCheck: function () {
            return this.$username.value.trim().length > 3;
        },

        passwordCheck: function () {
            return this.$password.value.trim().length > 5;
        },

        addErrorHint: function ($field) {
            if ($field.className.indexOf('error') == -1) {
                $field.className = ($field.className + ' error').trim();
            }
        },

        removeErrorHint: function ($field) {
            $field.className = $field.className.replace('error', '').trim();
        },

        onSubmit: function (e) {
            var usernameCheckPassed = this.usernameCheck(),
                passwordCheckPassed = this.passwordCheck();

            if (!usernameCheckPassed) {
                this.addErrorHint(this.$usernameField);
            }

            if (!passwordCheckPassed) {
                this.addErrorHint(this.$passwordField);
            }

            if (usernameCheckPassed && passwordCheckPassed) {
                return true;
            }

            if (e && e.preventDefault) {
                e.preventDefault();
            }

            return false;
        },

        init: function () {
            this.$username.addEventListener('keypress', this.removeErrorHint.bind(this, this.$usernameField), false);
            this.$password.addEventListener('keypress', this.removeErrorHint.bind(this, this.$passwordField), false);

            this.$form.onsubmit = null;
            this.$form.addEventListener('submit', this.onSubmit.bind(this), false);
        }
    };

    return App;
})();

