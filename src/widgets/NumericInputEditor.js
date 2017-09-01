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

  inputError: {
    borderColor: '#ea933e',
    color: '#ea933e',
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

  error: {
    background: '#ea933e',
    padding: 8,
    marginBottom: 16,
  },
  errorText: {
    color: 'white'
  }

});

class NumericInputEditor extends Component {

  render() {
    const hasError = this._hasError();
    return <Popover>
      <View style={[styles.input, hasError && styles.inputError]} />
      <View className="framework-perseus" style={styles.editor}>
        {hasError && <View style={styles.error}>
          <Text style={styles.errorText}>
            No answer specified!
          </Text>
        </View>}
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

  _hasError = () => {
    return !this.props.answers || this.props.answers.length === 0 ||
      this.props.answers[0].value == null;
  }
}

export default {
  editor: NumericInputEditor,
};
