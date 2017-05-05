import React, { Component } from 'react';
import { Editor, EditorState, Modifier, SelectionState } from 'draft-js';
import { View, Text, StyleSheet } from './base-components';
import ArtemisDecorator from './ArtemisDecorator';
import InlineElementOverlay from './InlineElementOverlay';
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
  state = {
    editorState: EditorState.createEmpty(new ArtemisDecorator()),
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.editorStackingContext}>
          <Editor
            spellCheck={true}
            editorState={this.state.editorState}
            onChange={this._handleDraftChange}
          />
        </View>
        <InlineElementOverlay
          contentState={this.state.editorState.getCurrentContent()}
          keypad={this.props.keypad}
          onChangeElement={this._onChangeElement}
        />
      </View>
    );
  }

  _onChangeElement = (key, data, updateSize) => {
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();

    const newContentState = contentState.mergeEntityData(key, data);

    let updates = {
      currentContent: newContentState,
    };
    if (updateSize) {
      // making a new decorator forces a rerun of the decorator.
      // TODO(aria): lament
      updates.decorator = new ArtemisDecorator();
    }

    return this.setState({
      editorState: EditorState.set(editorState, updates),
    });
  };
  _handleDraftChange = newEditorState => {
    // NOTE: This disables native optimizations so we can remeasure
    // equation/widget overlays on every keystroke
    // NOTE: We're also doing this on every cursor change. SORRY.
    return this.setState({
      editorState: EditorState.set(newEditorState, {
        nativelyRenderedContent: null,
      }),
    });
  };

  triggerAction(name) {
    if (name === 'INSERT_EQUATION') {
      const editorState = this.state.editorState;
      const contentState = editorState.getCurrentContent();

      const contentStateWithEntity = contentState.createEntity(
        'EQUATION',
        'IMMUTABLE',
        { value: 'x + 3' } // why not
      );

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const currSelection = editorState.getSelection();
      const newContentState = Modifier.replaceText(
        contentStateWithEntity,
        currSelection,
        // TODO(aria): Measure the width of this character to calculate the appropriate letter-spacing!
        // then we should replace the space with this:
        // this is a nice ... char, but has a width: '\u22EF',
        // This character is just a space so our letter spacing is closer to the correct width ouo:
        ' ',
        null,
        entityKey
      );

      const stateWithContent = EditorState.set(editorState, {
        currentContent: newContentState,
      });

      // build up a new selection just after the equation we inserted
      // TODO(aria): we might want this to select the equation instead?
      const stateWithSelection = EditorState.acceptSelection(
        stateWithContent,
        new SelectionState({
          anchorKey: currSelection.getStartKey(),
          anchorOffset: currSelection.getStartOffset() + 1,
          focusKey: currSelection.getEndKey(),
          focusOffset: currSelection.getStartOffset() + 1,
          isBackward: false,
          hasFocus: false,
        })
      );

      this.setState({
        editorState: stateWithSelection,
      });
    }
  }
}
