import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';
import { View, StyleSheet } from './base-components';
import ArtemisDecorator from './ArtemisDecorator';
import InlineWidgetOverlay from './InlineWidgetOverlay';
import 'draft-js/dist/Draft.css';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    position: 'relative',
  },

  editorStackingContext: {
    // defines a new stacking context so all z-indices inside are relative
    // to the editor, and the overlay remains on top of all editor components
    position: 'relative',
    zIndex: 0,
  },
});

export default class ArtemisEditor extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.editorStackingContext}>
          <Editor
            spellCheck={true}
            editorState={this.props.editorState}
            onChange={this._handleDraftChange}
          />
        </View>
        <InlineWidgetOverlay
          widgetEditors={this.props.widgetEditors}
          contentState={this.props.editorState.getCurrentContent()}
          keypad={this.props.keypad}
          onChangeElement={this._onChangeElement}
        />
      </View>
    );
  }

  _onChangeElement = (key, data, updateSize) => {
    const editorState = this.props.editorState;
    const contentState = editorState.getCurrentContent();

    const newContentState = contentState.mergeEntityData(key, data);

    let updates = {
      currentContent: newContentState,
    };

    // TODO(aria): just check for width/height here?
    if (updateSize) {
      // making a new decorator forces a rerun of the decorator.
      // TODO(aria): lament
      updates.decorator = new ArtemisDecorator();
    }

    return this.props.onChange(EditorState.set(editorState, updates));
  };

  _handleDraftChange = newEditorState => {
    // NOTE: This disables native optimizations so we can remeasure
    // equation/widget overlays on every keystroke
    // NOTE: We're also doing this on every cursor change. SORRY.
    return this.props.onChange(
      EditorState.set(newEditorState, {
        nativelyRenderedContent: null,
      })
    );
  };
}
