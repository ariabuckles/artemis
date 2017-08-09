import React, { Component } from 'react';
const classNames = require('classnames');

const PerseusMarkdown = require("./perseus-markdown");
const ApiClassNames = require("./perseus-api").ClassNames;

// TODO(aria): support all the div.paragraph and katex hacks in the actual
// renderer.jsx file ;_;

class RendererStub extends Component {

  static defaultProps = {
    content: '',
  };

  shouldComponentUpdate(nextProps) {
    // we don't do anything with widgets in this fake renderer, so:
    return nextProps.content !== this.props.content;
  }

  render() {
    const className = classNames({
      [ApiClassNames.RENDERER]: true,
      [ApiClassNames.RESPONSIVE_RENDERER]: true,
      [ApiClassNames.TWO_COLUMN_RENDERER]: false,
    });

    const parsed = PerseusMarkdown.parse(this.props.content);
    const output = PerseusMarkdown.basicOutput(parsed);

    return <div className={className}>
      {output}
    </div>
  }
}

module.exports = RendererStub;
