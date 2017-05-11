import React, { Component } from 'react';

import * as ArtemisActions from './ArtemisActions';
import { View, StyleSheet } from './base-components';


const styles = StyleSheet.create({
  debugContainer: {
    border: `1px dashed #ccc`,
  },
});

export default class ArtemisToolbar extends Component {
  render() {
    return (
      <View style={this.props.debug ? styles.debugContainer : null}>
        <View
          onClick={() => this.props.onAction(ArtemisActions.newInlineMath())}
        >
          inline-math
        </View>
        <View
          onClick={() => this.props.onAction(ArtemisActions.insertWidget('numeric-input'))}
        >
          numeric-input
        </View>
      </View>
    );
  }
}
