import React, { Component } from 'react';

import '../FontAwesome';
import { Text, View, StyleSheet } from '../base-components';

import Popover from '../helpers/Popover';

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
    fontSize: 16,
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

  inputError: {
    borderColor: '#ea933e',
    color: '#ea933e',
  },
  error: {
    background: '#ea933e',
    padding: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  errorText: {
    color: 'white'
  }

});

class TextInputEditor extends Component {

  static defaultProps = {
    value: "",
    editDistance: 0,
  };

  render() {
    const hasError = this._hasError();
    return <Popover>
      <View style={[styles.input, hasError && styles.inputError]} />
      <View style={styles.editor}>
        {hasError && <View style={styles.error}>
          <Text style={styles.errorText}>
            No correct answer specified!
          </Text>
        </View>}
        <View>
          <input
            value={this.props.value || ""}
            onChange={this._onInputChange}
          />
        </View>
      </View>
    </Popover>;
  }

  _onInputChange = (e) => {
    this.props.onChange({
      value: e.target.value,
      editDistance: 0,
    });
  };

  _hasError = () => {
    return !this.props.value;
  }
}

export default {
  editor: TextInputEditor,
};
