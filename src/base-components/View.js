import React, { Component } from 'react';
import { css } from 'aphrodite';

export default class View extends Component {
  render() {
    const { style, ...props } = this.props;
    return (
      <div className={css(style)} {...props}>
        {this.props.children}
      </div>
    );
  }
}
