import React, { Component } from 'react';

// An input for urls. modified from BlurInput
export default class UrlInput extends Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  };

  state = { value: this.props.value || '' };

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value || '' });
  }

  render() {
    return <form onSubmit={this._submit}>
      <input
        {...this.props}
        type="text"
        value={this.state.value}
        onChange={this._handleChange}
        onBlur={this._blur}
        onPaste={this._paste}
        onFocus={this._focus}
      />
    </form>;
  }

  _handleChange = (e) => {
    this.setState({ value: e.target.value });
    if (!e.target.value) {
      this.props.onChange(null);
    }
  }

  _submit = (e) => {
    e.preventDefault();
    this.props.onChange(e.target.value || null);
  }

  _blur = (e) => {
    this.props.onChange(e.target.value || null);
  }

  _paste = (e) => {
    // we could do e.clipboardData.getData('text'), but then we might miss
    // the previous state of this text box
    setTimeout(() => this.props.onChange(this.state.value || null), 0);
  }

  _focus = (e) => {
    e.target.setSelectionRange(0, e.target.value.length);
  }
}

