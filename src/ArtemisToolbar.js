import React, { Component } from 'react';

import * as ArtemisActions from './ArtemisActions';
import { View, StyleSheet } from './base-components';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
  },
});

export default class ArtemisToolbar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <button
          onClick={() => this.props.onAction(ArtemisActions.newInlineMath())}
        >
          Eq
        </button>
      </View>
    );
  }
}
