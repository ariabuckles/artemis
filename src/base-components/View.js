import React, { Component } from 'react';
import { css } from 'aphrodite';
import * as StyleUtils from './StyleUtils';

export default class View extends Component {
  render() {
    const { style, className, ...props } = this.props;

    let fullClassName = "";
    if (className) {
      fullClassName += className + ' ';
    }

    if (Array.isArray(style)) {
      fullClassName += css.apply(null, style);
    } else if (style) {
      fullClassName += css(style);
    }

    const styleInfo = StyleUtils.stylesToAphrodite(
      this.props.className,
      this.props.style
    );
    return (
      <div {...this.props} {...styleInfo}>
        {this.props.children}
      </div>
    );
  }
}
