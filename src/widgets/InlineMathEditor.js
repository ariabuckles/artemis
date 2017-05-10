import React, { Component } from 'react';

const { KeypadInput } = require('../MathInput').components;
// const { KeypadTypes } = require('../MathInput').consts;

const keypadInputStyle = {
  backgroundColor: 'transparent',
  pointerEvents: 'auto',
};

export default class InlineMathEditor extends Component {

  shouldComponentUpdate(nextProps, nextState) {
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
        onChange={this._changeValue}
        keypadElement={this.props.keypad && this.props.keypad.getElement()}
      />
    );
  }

  _changeValue = newValue => {
    this.props.onChange({
      value: newValue,
    });
  };
}
