import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { View, Text, StyleSheet } from './base-components';
import { css } from 'aphrodite';

// TODO(aria): Fix the dependency order issue here so these can be imports.
// ugh mathquill global jQuery dep
window.jQuery = require('jquery');
require('mathquill/build/mathquill.css');
require('mathquill/build/mathquill-basic.js');
const MathQuill = window.MathQuill;

// TODO(aria): Pull these dependencies into separate files so that import works instead of require.
window.i18n = {
  _: str => str,
};
const { KeypadInput } = require('./math-input').components;
const { KeypadTypes } = require('./math-input').consts;


const keypadInputStyle = {
  backgroundColor: 'transparent',
  pointerEvents: 'auto',
};

export class FloatingMathEditor extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.value !== this.props.value ||
      // TODO(aria): check for differences in the actual keypad.getElement()
      nextProps.keypad !== this.props.keypad
    );
  }

  render() {
    return (
      <KeypadInput
        style={keypadInputStyle}
        value={this.props.value}
        onChange={this.props.onChange}
        keypadElement={this.props.keypad && this.props.keypad.getElement()}
      />
    );
  }

  componentDidMount() {
    this._measure();
  }

  componentDidUpdate() {
    this._measure();
  }

  _measure = () => {
    const node = ReactDOM.findDOMNode(this);

    // HACK(aria): node's size is incorrect here; we need to grab the
    // inner node, which has a larger size ://///
    // TODO(aria): cry more
    const mathNode = node.getElementsByClassName('mq-editable-field')[0];

    const rect = mathNode.getBoundingClientRect();
    const { lastWidth, lastHeight } = this.props;

    if (rect.width !== lastWidth || rect.height !== lastHeight) {
      this.props.onMeasure(rect);
    }
  };
}
