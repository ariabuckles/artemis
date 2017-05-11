import React, { Component } from 'react';

import '../FontAwesome';
import { View, StyleSheet } from '../base-components';

import Popover from '../helpers/Popover';

const styles = StyleSheet.create({
  input: {
    display: 'flex',
    minWidth: 64,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderColor: 'rgb(186, 190, 194)',
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 48,
    padding: '6px 6px 1px',
    color: 'inherit',
    ':after': {
      fontFamily: 'FontAwesome',
      content: '"\\f040"',
      display: 'block',
      width: '100%',
      fontSize: 30,
      color: 'inherit',
      lineHeight: 1.1,
    }
  },

  editor: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    border: `2px solid #4FAED1`,
    margin: 8,
  },
});

export default class NumericInputEditor extends Component {

  render() {
    return <Popover>
      <View style={styles.input} />
      <View style={styles.editor} />
    </Popover>;
  }
}
