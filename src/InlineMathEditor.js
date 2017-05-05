import React, { Component } from 'react';
import { View, Text, StyleSheet } from './base-components';
import { css } from 'aphrodite';

// TODO(aria): Fix the dependency order issue here so these can be imports.
// ugh mathquill global jQuery dep
//window.jQuery = require('jquery');
//require('mathquill/build/mathquill.css');
//require('mathquill/build/mathquill-basic.js');
//const MathQuill = window.MathQuill;

// TODO(aria): Pull these dependencies into separate files so that import works instead of require.
window.i18n = {
  _: str => str,
};
const { KeypadInput } = require('./math-input').components;
const { KeypadTypes } = require('./math-input').consts;

const styles = StyleSheet.create({
  placeholder: {
    letterSpacing: 80, // customize per width
    backgroundColor: '#ddffdd',
    verticalAlign: 'middle',
    fontSize: 28, // customize per height
  },
});

export class InlineMathPlaceholder extends Component {
  render() {
    // TODO(aria): Make this style dynamic for sizing
    // This is rendering a single character because we only render InlineMathEditor's
    // with this.props.children as single characters. Draft requires us to
    // render {this.props.children} and only {this.props.children} for cursors to
    // work correctly
    //debugger;
    return (
      <span
        style={{
          letterSpacing: 80, // customize per width
          backgroundColor: '#ddffdd',
          verticalAlign: 'middle',
          fontSize: 28, // customize per height
        }}
        data-artemis-id={this.props.entityKey}
      >
        {this.props.children}
      </span>
    );
  }
}

export class FloatingMathEditor extends Component {

  render() {

  }

}

