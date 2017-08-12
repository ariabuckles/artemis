import React, { Component } from 'react';

import '../FontAwesome';
import { View, StyleSheet } from '../base-components';

import Popover from '../helpers/Popover';

import '../lib/perseus/perseus-css';
import PerseusExpressionEditor from '../lib/perseus/widgets/expression-editor';

const styles = StyleSheet.create({
  input: {
    display: 'flex',
    minWidth: 128,
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
    width: 360,
    maxHeight: 500,
    overflowY: 'scroll',
    backgroundColor: 'white',
    border: `2px solid #4FAED1`,
    borderRadius: 5,
    margin: 8,
    paddingTop: 0, // our header has a 16px top margin anyways
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
});

class ExpressionEditor extends Component {

  render() {
    return <Popover>
      <View style={styles.input} />
      <View className="framework-perseus" style={styles.editor}>
        <PerseusExpressionEditor
          {...this.props}
          onChange={this.props.onChange}
        />
      </View>
    </Popover>;
  }
}

export default {
  editor: ExpressionEditor,
};
