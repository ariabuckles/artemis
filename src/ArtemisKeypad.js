import React, { Component } from 'react';

// TODO(aria): Pull these dependencies into separate files so that import works instead of require.
window.i18n = {
  _: str => str,
};
window.katex = require('katex');
const { Keypad } = require('./math-input').components;
const { KeypadTypes } = require('./math-input').consts;

export default class ArtemisKeypad extends Component {

  _dismissListeners = [];

  _dismiss = () => {
    for (const dismissListener of this._dismissListeners) {
      dismissListener();
    }
  };

  render() {
    return <Keypad
      onElementMounted={(element) => {
        this._element = element;
      }}
      onDismiss={this._dismiss}
      style={this.props.style}
    />;
  }

  getElement = () => {
    return this._element;
  };

  addDismissListener = (newListener) => {
    this._dismissListeners.push(newListener);
  };

  removeDismissListener = (oldListener) => {
    this._dismissListeners = this._dismissListeners.filter((listener) => {
      return listener !== oldListener;
    });
  };
}
