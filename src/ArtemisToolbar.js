import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

import * as ArtemisActions from './ArtemisActions';
import { View, Text, StyleSheet } from './base-components';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
  },
});

export default class ArtemisToolbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <button onClick={() => this.props.onAction(ArtemisActions.newInlineMath())}>
          Eq
        </button>
      </View>
    );
  }
}
