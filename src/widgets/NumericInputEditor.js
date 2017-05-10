import React, { Component } from 'react';

import { View, StyleSheet } from '../base-components';

import Popover from '../helpers/Popover';

const styles = StyleSheet.create({
  input: {
    width: 40,
    height: 20,
    backgroundColor: 'orange',
  },

  editor: {
    width: 200,
    height: 200,
    backgroundColor: 'purple',
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

