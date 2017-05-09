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

const styles = StyleSheet.create({
  overlay: {
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(240, 240, 120, 0.5)',
  },
});

export class InlineMathPlaceholder extends Component {
  constructor(props) {
    super(props);

    this.state = this._calculateSpecifiedDimensions(props);
    this.state.widthModifier = 0;
  }

  _calculateSpecifiedDimensions = props => {
    const { contentState, entityKey } = this.props;
    const entity = contentState.getEntity(entityKey);
    const entityData = entity.getData();

    return {
      specifiedWidth: entityData.width || 40,
      specifiedHeight: entityData.height || 20,
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState(this._calculateSpecifiedDimensions(nextProps));
  }

  render() {
    // TODO(aria): Make this style dynamic for sizing
    // This is rendering a single character because we only render InlineMathEditor's
    // with this.props.children as single characters. Draft requires us to
    // render {this.props.children} and only {this.props.children} for cursors to
    // work correctly
    //debugger;

    const { entityKey } = this.props;

    const { specifiedWidth, specifiedHeight, widthModifier } = this.state;

    const style = {
      letterSpacing: specifiedWidth + widthModifier + 2, // 2 from padding (hax)

      // TODO(aria): uhhhh what to put here. mostly affects highlighting
      fontSize: specifiedHeight - 5,
      // Line height doesn't actually make the box the correct height, but it does
      // size the overall line correctly. sorta weird, i know.
      lineHeight: specifiedHeight + 2 + 'px', // 2 from the padding (haxx)

      verticalAlign: 'middle',

      //color: 'transparent',
    };

    return (
      <span style={style} data-artemis-id={this.props.entityKey}>
        {this.props.children}
      </span>
    );
  }

  componentDidMount() {
    this._measure();
  }

  componentDidUpdate() {
    this._measure();
  }

  _measure = () => {
    // TODO(aria) remove this.
    // This should no longer be necessary now that we're using the
    // invisible separator character instead of a space or '.'
    // Remove this once we have this stored in git history or
    // when we're confident the invisible separator character hack
    // is working
    const node = ReactDOM.findDOMNode(this);
    const rect = node.getBoundingClientRect();

    const desiredWidth = this.state.specifiedWidth + 2; // 2 from padding
    const errorMargin = desiredWidth + this.state.widthModifier - rect.width;
    if (errorMargin !== this.state.widthModifier) {
      this.setState({ widthModifier: errorMargin });
    }
  };
}

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
