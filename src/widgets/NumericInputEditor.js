import React, { Component } from 'react';

import '../FontAwesome';
import { Text, View, StyleSheet } from '../base-components';

import Popover from '../helpers/Popover';

import '../lib/perseus/perseus-css';
import PerseusNumericInputEditor from '../lib/perseus/widgets/numeric-input-editor';

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
    textAlign: 'center',
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
    color: '#444444',
    width: 280,
    height: 360,
    overflowY: 'scroll',
    backgroundColor: 'white',
    border: `2px solid #4FAED1`,
    borderRadius: 5,
    margin: 8,
    padding: 10,
  },

  header: {
    display: 'block',
    fontSize: '1.4em',
    marginBottom: 8,
  },
});

class NumericInputEditor extends Component {

  render() {
    return <Popover>
      <View style={styles.input} />
      <View className="framework-perseus" style={styles.editor}>
        <Text style={styles.header}>
          Solution:
        </Text>
        <PerseusNumericInputEditor
          {...this.props}
          onChange={this.props.onChange}
        />
      </View>
    </Popover>;
  }
}

export default {
  editor: NumericInputEditor,
};
