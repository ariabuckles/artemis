import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import InlineWidgetNotFoundEditor from './widgets/InlineWidgetNotFoundEditor';

export default class InlineWidgetEditor extends Component {

  _measure = () => {
    const node = ReactDOM.findDOMNode(this);

    if (node == null) {
      // We reach this code path if our editor renders `null`
      return;
    }

    // We used to find the mq-editable-field node here, but since removing
    // the size constraint on this View, it seems like we're able to safely
    // just check this node's size :D
    const rect = node.getBoundingClientRect();
    const { lastWidth, lastHeight } = this.props;

    if (rect.width !== lastWidth || rect.height !== lastHeight) {
      this.props.onMeasure(rect);
    }
  };

  componentDidMount() {
    // Some components may change sizes later. yuck!
    const node = ReactDOM.findDOMNode(this);
    if (node !== null) {
      this._observer.observe(node, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }

    // We delay this to wait for aphrodite styles to resolve ;_;
    setTimeout(this._measure, 0);
  }

  componentDidUpdate = () => {
    // We delay this to wait for aphrodite styles to resolve ;_;
    setTimeout(this._measure, 0);
  }

  _observer = new MutationObserver(this.componentDidUpdate)

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
      return <InlineWidgetNotFoundEditor
        type={type}
      />;
    } else {
      return <WidgetEditor
        {...options}
        onChange={onChange}
        keypad={keypad}
      />;
    }
  }

  componentWillUnmount() {
    this._observer.disconnect();
  }
}
