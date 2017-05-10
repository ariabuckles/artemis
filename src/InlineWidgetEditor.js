import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { View, Text, StyleSheet } from './base-components';
import { css } from 'aphrodite';

import InlineMathEditor from './widgets/InlineMathEditor';
import InlineWidgetNotFoundEditor from './widgets/InlineWidgetNotFoundEditor';

export default class InlineWidgetEditor extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.options !== this.props.options ||
      // TODO(aria): check for differences in the actual keypad.getElement()
      nextProps.keypad !== this.props.keypad
    );
  }

  render() {
    const { type, widgetEditors, options, onChange, keypad } = this.props;

    const WidgetEditor = widgetEditors[type];

    if (WidgetEditor == null) {
      return <InlineWidgetNotFoundEditor type={type} />
    }
    else {
      return (
        <WidgetEditor {...options} onChange={onChange} keypad={keypad} />
      );
    }
  }

  componentDidMount() {
    // We delay this to wait for aphrodite styles to resolve ;_;
    setTimeout(this._measure, 0);
  }

  componentDidUpdate() {
    // We delay this to wait for aphrodite styles to resolve ;_;
    setTimeout(this._measure, 0);
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
