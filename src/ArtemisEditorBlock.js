import React, { Component } from "react";
import { EditorBlock } from "draft-js";
import { View, Text, StyleSheet } from "./base-components";

const styles = StyleSheet.create({
  artemisEditorBlock: {
    position: 'relative',
  },
  overlayThing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 40,
    backgroundColor: 'yellow',
  },
});

export default class ArtemisEditorBlock extends Component {

  render() {
    const {block, contentState} = this.props;

    let entities = [];
    block.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (entityKey == null) {
        return;
      }
      entities.push(contentState.getEntity(entityKey));
    });

    return <View style={styles.artemisEditorBlock}>
      <EditorBlock {...this.props} />
      <View contentEditable={false} style={styles.overlayThing}>
        <Text>
          {entities.length} entities
        </Text>
      </View>
    </View>;
  }

}
