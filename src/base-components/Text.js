import React, { Component } from "react";
import { css } from "aphrodite";

export default class Text extends Component {
  render() {
    const { style, ...props } = this.props;
    return (
      <span className={css(style)}>
        {this.props.children}
      </span>
    );
  }
}
