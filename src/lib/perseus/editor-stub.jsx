import React, { Component } from 'react';

class EditorStub extends Component {
  render() {
    return <div className="perseus-single-editor">
      <textarea
        style={{width: '100%'}}
        className="perseus-textarea-pair"
        value={this.props.content || ""}
        placeholder={this.props.placeholder}
        onChange={(e) => {
          this.props.onChange({
            content: e.target.value,
          });
        }}
      />
    </div>
  }
}

module.exports = EditorStub;
