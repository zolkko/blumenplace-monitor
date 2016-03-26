"use strict";

import sajax from "./sajax.js";


class App {
  constructor () {
    this.$email = document.getElementById("email");
    this.$password = document.getElementById("password");
    this.$emailField = document.getElementById("email-field");
    this.$passwordField = document.getElementById("password-field");
    this.$form = document.querySelector("form");
  }

  initialize() {
    this.$email.addEventListener("keypress", this.removeErrorHint.bind(this, this.$emailField), false);
    this.$password.addEventListener("keypress", this.removeErrorHint.bind(this, this.$passwordField), false);
    this.$form.onsubmit = null;
    this.$form.addEventListener("submit", this.onSubmit.bind(this), false);
    return this;
  }

  checkEmail(value) {
    return value.length > 3;
  }

  checkPassword(value) {
    return value.length > 5;
  }

  addErrorHint($field) {
    if ($field.className.indexOf("error") == -1) {
      $field.className = ($field.className + " error").trim();
    }
  }

  removeErrorHint($field) {
    $field.className = $field.className.replace("error", "").trim();
  }

  onSubmit(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    let email = this.$email.value.trim(),
      password = this.$password.value.trim();

    let emailCheckPassed = this.checkEmail(email),
      passwordCheckPassed = this.checkPassword(password);

    if (!emailCheckPassed) {
      this.addErrorHint(this.$emailField);
    }

    if (!passwordCheckPassed) {
      this.addErrorHint(this.$passwordField);
    }

    if (emailCheckPassed && passwordCheckPassed) {
      sajax.post("http://192.168.99.100/tokens", {
        "email": this.$email.value.trim(),
        "password": this.$password.value.trim()
      })
        .then(JSON.parse)
        .then(respose => {
          if (respose.hasOwnProperty("accessToken")) {
            throw new "Malformed authentication response";
          }
        })
        .then(resp => this.onAuthenticated(resp))
        .catch(error => this.onAuthError("failed to send request to auth server"));
      return false;
    }

    return false;
  }

  onAuthenticated(email, password, tokenData) {
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("accessToken", tokenData.accessToken);

    window.location.replace("/index.html");
  }

  onAuthError(error) {
    sessionStorage.setItem("email", null);
    sessionStorage.setItem("password", null);
    sessionStorage.setItem("accessToken", null);

    window.alert(error);
  }
}


export default App;
