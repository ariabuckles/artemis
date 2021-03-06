import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { View, StyleSheet } from './base-components';
import InlineWidgetEditor from './InlineWidgetEditor';

const styles = StyleSheet.create({
  inlineWidgetOverlay: {
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

  componentDidMount() {
    this._measureSelf();
  }

  componentDidUpdate() {
    this._measureSelf();
  }

  _measureSelf = () => {
    const node = ReactDOM.findDOMNode(this);
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
    const { editorWidth, widgetEditors, block, contentState } = this.props;

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
      <View style={styles.blockOverlay}>
        {this.state.pos &&
          entities.map(e => {
            // TODO(aria): Change `document` here to `ReactDOM.findDOMNode(this)`
            const entityElement = document.querySelector(
              `[data-artemis-id="${e.key}"]`
            );

            if (entityElement && this.state.pos) {
              const pos = entityElement.getBoundingClientRect();

              const widgetType = e.entity.getType();
              const entityData = e.entity.getData();

              const entityOffset = ((entityData.height || 0) - pos.height) / 2;

              return (
                <span
                  key={e.key}
                  style={{
                    position: 'absolute',
                    top: pos.top - this.state.pos.top - entityOffset,
                    left: pos.left - this.state.pos.left,
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                    padding: 1,
                    pointerEvents: 'none',
                    width: editorWidth,
                  }}
                >
                  <InlineWidgetEditor
                    type={widgetType}
                    widgetEditors={widgetEditors}
                    options={entityData.options}
                    lastWidth={entityData.width}
                    lastHeight={entityData.height}
                    keypad={this.props.keypad}
                    onChange={newOptions => {
                      const options = Object.assign(
                        {},
                        entityData.options,
                        newOptions
                      );
                      this.props.onChange(e.key, { options: options });
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

export default class InlineWidgetOverlay extends Component {
  render() {
    const { editorWidth, widgetEditors, contentState, keypad, onChangeElement } = this.props;

    let blockOverlays = [];
    for (const [key, block] of contentState.getBlockMap().entries()) {
      if (block.getType() !== 'atomic') {
        blockOverlays.push(
          <BlockOverlay
            key={key}
            widgetEditors={widgetEditors}
            editorWidth={editorWidth}
            contentState={contentState}
            block={block}
            keypad={keypad}
            onChange={onChangeElement}
          />
        );
      }
    }

    return (
      <View style={styles.inlineWidgetOverlay}>
        {blockOverlays}
      </View>
    );
  }
}
