import React, { Component } from 'react';
import { css } from 'aphrodite';

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

    return (
      <div className={fullClassName} {...props}>
        {this.props.children}
      </div>
    );
  }
}
