import React, { Component } from "react";
import ReactDOM from "react-dom";
import { EditorBlock } from "draft-js";
import { View, Text, StyleSheet } from "./base-components";

const styles = StyleSheet.create({
  artemisEditorBlock: {
    position: "relative",
  },
  overlayThing: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default class ArtemisEditorBlock extends Component {
  state = {
    pos: null,
  };
  _renderCount = 0;
  componentDidMount() {
    this._measureSelf();
  }
  componentWillUpdate() {
    if (this._renderCount !== 1) {
      this._renderCount = 0;
    }
  }
  componentDidUpdate() {
    this._measureSelf();
    if (this._renderCount < 2) {
      this.forceUpdate();
    }
  }

  _measureSelf = () => {
    const node = ReactDOM.findDOMNode(this._ref);
    const newPos = node.getBoundingClientRect();
    if (!this.state.pos || newPos.top !== this.state.pos.top || newPos.left !== this.state.pos.left) {
      this.setState({ pos: newPos });
    }
  };

  render() {
    const { block, contentState } = this.props;
    this._renderCount++;

    let entities = [];
    block.findEntityRanges(character => {
      const entityKey = character.getEntity();
      if (entityKey == null) {
        return;
      }
      entities.push({
        key: entityKey,
        entity: contentState.getEntity(entityKey),
      });
    });

    return (
      <View style={styles.artemisEditorBlock} ref={n => this._ref = n}>
        <EditorBlock {...this.props} />
        <View contentEditable={false} style={styles.overlayThing}>
          {this.state.pos &&
            entities.map(e => {
              const entityElement = document.querySelector(`[data-artemis-id="${e.key}"]`);
              if (entityElement && this._ref) {
                const pos = entityElement.getBoundingClientRect();
                return (
                  <span
                    key={e.key}
                    style={{
                      position: "absolute",
                      top: pos.top - this.state.pos.top,
                      width: pos.width,
                      left: pos.left - this.state.pos.left,
                      height: pos.height,
                      backgroundColor: "rgba(255, 0, 0, 0.4)",
                    }}
                  >
                    {e.key}
                  </span>
                );
              }
              return null;
            })}
        </View>
      </View>
    );
  }
}
