import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { EditorBlock } from 'draft-js';
import { View, Text, StyleSheet } from './base-components';
import { FloatingMathEditor } from './InlineMathEditor';

const styles = StyleSheet.create({
  inlineElementOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  BlockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

class BlockOverlay extends Component {
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
    // TODO(aria): replace this._ref with this
    const node = ReactDOM.findDOMNode(this._ref);
    const newPos = node.getBoundingClientRect();
    if (
      !this.state.pos ||
      newPos.top !== this.state.pos.top ||
      newPos.left !== this.state.pos.left
    ) {
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
      <View style={styles.blockOverlay} ref={n => this._ref = n}>
        {this.state.pos &&
          entities.map(e => {
            const entityElement = document.querySelector(
              `[data-artemis-id="${e.key}"]`
            );

            if (entityElement && this._ref) {
              const pos = entityElement.getBoundingClientRect();

              const entityData = e.entity.getData();

              return (
                <span
                  key={e.key}
                  style={{
                    position: 'absolute',
                    top: pos.top - this.state.pos.top,
                    left: pos.left - this.state.pos.left,
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                  }}
                >
                  <FloatingMathEditor
                    value={entityData.value}
                    lastWidth={entityData.width}
                    lastHeight={entityData.height}
                    keypad={this.props.keypad}
                    onChange={value => {
                      this.props.onChange(e.key, { value: value });
                    }}
                    onMeasure={rect => {
                      this.props.onChange(
                        e.key,
                        {
                          width: rect.width,
                          height: rect.height,
                        },
                        true
                      );
                    }}
                  />
                </span>
              );
            }
            return null;
          })}
      </View>
    );
  }
}

export default class InlineElementOverlay extends Component {
  render() {
    const { contentState, keypad, onChangeElement } = this.props;
    const blocks = contentState.getBlockMap().toArray();

    return (
      <View style={styles.inlineElementOverlay}>
        {blocks.map(block => {
          return (
            <BlockOverlay
              contentState={contentState}
              block={block}
              keypad={keypad}
              onChange={onChangeElement}
            />
          );
        })}
      </View>
    );
  }
}
