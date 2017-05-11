import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { View, StyleSheet } from '../base-components';

const styles = StyleSheet.create({
  unfocused: {
    pointerEvents: 'auto',
    color: '#ccc'
  },

  focused: {
    boxShadow: `0 0 0 2px #4FAED1`,
    color: '#4FAED1',
    borderRadius: 4,
    pointerEvents: 'auto',
  },

  hoverContainer: {
    position: 'fixed',
    right: 0,
    bottom: 0,
  },
});

export default class Popover extends Component {

  state = {
    focused: false,
  }

  render() {
    const { focused } = this.state;

    const baseElement = this.props.children[0];
    const hoverElement = this.props.children[1];

    return <View
      style={focused ? styles.focused : styles.unfocused}
      onClick={this.focus}
    >
      {baseElement}
      {focused &&
        <View style={styles.hoverContainer}>
          {hoverElement}
        </View>
      }
    </View>;
  }

  focus = () => this.setState({ focused: true });
  blur = () => this.setState({ focused: false });

  _blurOnClickElsewhere = (e) => {
    const node = ReactDOM.findDOMNode(this);
    if (!node.contains(e.target)) {
      this.blur();
    }
  };

  componentDidMount() {
    window.addEventListener('click', this._blurOnClickElsewhere);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this._blurOnClickElsewhere);
  }
}
