import React, { Component } from 'react';
import * as StyleUtils from './StyleUtils';

export default class Text extends Component {
  render() {
    const { style, className, ...props } = this.props;

    const styleInfo = StyleUtils.stylesToAphrodite(
      this.props.className,
      this.props.style
    );
    return (
      <span {...this.props} {...styleInfo}>
        {this.props.children}
      </span>
    );
  }
}
