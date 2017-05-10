import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { View, Text, StyleSheet } from './base-components';
import { css } from 'aphrodite';

import InlineMathEditor from './widgets/InlineMathEditor';

export default class InlineWidgetEditor extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.options !== this.props.options ||
      // TODO(aria): check for differences in the actual keypad.getElement()
      nextProps.keypad !== this.props.keypad
    );
  }

  render() {
    const { options, onChange, keypad } = this.props;
    return (
      <InlineMathEditor
        {...options}
        onChange={onChange}
        keypad={keypad}
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

    // We used to find the mq-editable-field node here, but since removing
    // the size constraint on this View, it seems like we're able to safely
    // just check this node's size :D
    const rect = node.getBoundingClientRect();
    const { lastWidth, lastHeight } = this.props;

    if (rect.width !== lastWidth || rect.height !== lastHeight) {
      this.props.onMeasure(rect);
    }
  };
}

