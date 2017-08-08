import React, { Component } from 'react';
import * as StyleUtils from './StyleUtils';

export default class View extends Component {
  render() {
    const { style, className, ...props } = this.props;

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
