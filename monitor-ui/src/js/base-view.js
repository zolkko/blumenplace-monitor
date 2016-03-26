import React from 'react';
import Backbone from 'backbone';


class BaseView extends Backbone.View {
  initialize (options) {
    this.options = options || {};
  }

  component () {
    return null;
  }

  render () {
    React.renderComponent(this.component(), this.el);
    return this;
  }
});

export default BaseView;

