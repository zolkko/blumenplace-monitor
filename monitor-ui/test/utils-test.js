import buster from "buster";
import _ from "lodash";
import * as User from "../src/js/services/user";
import * as Token from "../src/js/services/token";

let assert = buster.assert;


buster.testCase("Test case for isEmailValid function", {
    "E-mail must be match pattern": function () {
        assert.isTrue(User.isEmailValid("1@1"));
    },

    "E-mail should contains @ symbol": function () {
        assert.isFalse(User.isEmailValid("1"));
    },

    "Verification fails if e-mail is empty": function () {
        assert.isFalse(User.isEmailValid(""));
    },

    "Verification fails if e-mail is not string": function () {
        assert.isFalse(User.isEmailValid(null));
        assert.isFalse(User.isEmailValid(123));
        assert.isFalse(User.isEmailValid({}));
        assert.isFalse(User.isEmailValid(x => x));
    },

    "E-mail must starts with symbol followed with @domain": function () {
        assert.isFalse(User.isEmailValid("@domain"));
    }
});

buster.testCase("Test case for isPasswordValid function", {
    "Password must be longer that 1 symbol": function () {
        assert.isTrue(User.isPasswordValid("1"));
    },

    "Password cannot be empty string": function () {
        assert.isFalse(User.isPasswordValid(""));
    },

    "Password cannot be null": function () {
        assert.isFalse(User.isPasswordValid(null));
    },

    "Password must be a string": function () {
        assert.isFalse(User.isPasswordValid(123));
        assert.isFalse(User.isPasswordValid(true));
        assert.isFalse(User.isPasswordValid({}));
        assert.isFalse(User.isPasswordValid(x => x));
    }
});

buster.testCase("Test case for isNotExpire function", {
    "Expire at value must bigger then current time": function () {
        this.stub(_, "now", () => 2);
        assert.isTrue(Token.isNotExpire(3));
    },

    "Value considered expired if value is equal to current time": function () {
        this.stub(_, "now", () => 2);
        assert.isFalse(Token.isNotExpire(2));
    },

    "Value considered expired if value is smaller then current time": function () {
        this.stub(_, "now", () => 2);
        assert.isFalse(Token.isNotExpire(1));
    },

    "Expire at value must be a number": function () {
        this.stub(_, "now", () => 1);
        assert.isFalse(Token.isNotExpire(null));
        assert.isFalse(Token.isNotExpire("zzz"));
        assert.isFalse(Token.isNotExpire({}));
        assert.isFalse(Token.isNotExpire([1,2,3]));
    }
});

buster.testCase("Test case for token validation", {
    "Access token must be a string": function () {
        assert.isFalse(Token.isAccessTokenValid(true), "token must be a string, not a boolean 'true'");
        assert.isFalse(Token.isAccessTokenValid(false), "token must be a string, not a boolean 'false'");
    },

    "An empty string is not a valid token": function () {
        assert.isFalse(Token.isAccessTokenValid(""), "An empty string is not a valid access-token");
    },

    "Non empty string is considered as a valid token": function () {
        assert.isTrue(Token.isAccessTokenValid("1"), "Non-empty string is a valid access-token");
    }
});

buster.testCase("Test case for isSignedIn function", {
    "A user is signed-in if access-token is valid and it is not expired": function () {
        this.stub(_, "now", () => 1);
        assert.isTrue(Token.isSignedIn("1", 2));
    },

    "If an access-token is not valid but not expired, a user is not signed-in": function () {
        this.stub(_, "now", () => 1);
        assert.isFalse(Token.isSignedIn(null, 2));
    },

    "If an access-token is valid but it is expired, a user is not signed-in": function () {
        this.stub(_, "now", () => 1);
        assert.isFalse(Token.isSignedIn("1", 1));
    },

    "If both access-token and expire-at fails, a user considered not signed-in": function () {
        this.stub(_, "now", () => 1);
        assert.isFalse(Token.isSignedIn("1", 1));
    }
});
