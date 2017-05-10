import React, { PureComponent } from 'react';

import { View, Text, StyleSheet } from '../base-components';

const styles = StyleSheet.create({
  inlineWidgetNotFoundEditor: {
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    whiteSpace: 'nowrap',
    backgroundColor: 'pink',
    padding: 2,
  },
});

export default class InlineWidgetNotFoundEditor extends PureComponent {
  render() {
    const { type } = this.props;
    return (
      <View style={styles.inlineWidgetNotFoundEditor}>
        <Text>
          Widget type '{type}' not found
        </Text>
      </View>
    );
  }
}
