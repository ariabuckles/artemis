import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { View, StyleSheet } from '../base-components';

const styles = StyleSheet.create({

  baseStackingContext: {
    // create a new stacking context for the base of the popover
    // so that aboveScratchpad effects from perseus
    // can't float over the editor :o
    position: 'relative',
    zIndex: 0,
  },

  unfocused: {
    display: 'inline-block',
    maxWidth: '100%',
    pointerEvents: 'auto',
    color: '#ccc'
  },

  focused: {
    display: 'inline-block',
    maxWidth: '100%',
    boxShadow: `0 0 0 2px #4FAED1`,
    color: '#4FAED1',
    borderRadius: 4,
    pointerEvents: 'auto',
  },

  hoverContainer: {
    position: 'fixed',
    zIndex: 1,
    right: 0,
    bottom: 0,
  },

});

export default class Popover extends Component {

  state = {
    focused: this.props.autoFocus || false,
  }

  render() {
    const { focused } = this.state;

    const baseElement = this.props.children[0];
    const hoverElement = this.props.children[1];

    return <View
      style={focused ? styles.focused : styles.unfocused}
      onClick={this.focus}
    >
      <View style={styles.baseStackingContext}>
        {baseElement}
      </View>
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
    window.addEventListener('click', this._blurOnClickElsewhere, true);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this._blurOnClickElsewhere, true);
  }
}
