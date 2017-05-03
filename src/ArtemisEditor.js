import React, { Component } from "react";
import { Editor, EditorState, Modifier, SelectionState } from "draft-js";
import { View, Text, StyleSheet } from "./base-components";
import ArtemisDecorator from './ArtemisDecorator';
import "draft-js/dist/Draft.css";

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "solid",
  },
});

export default class ArtemisEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(ArtemisDecorator),
    };

    this._handleDraftChange = this._handleDraftChange.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Editor editorState={this.state.editorState} onChange={this._handleDraftChange} onContentChange={this._contentChange} />
      </View>
    );
  }

  _handleDraftChange(newEditorState) {
    this.setState({ editorState: newEditorState });
  }

  _contentChange = (state) => {
    console.log('content change');
  };

  triggerAction(name) {
    if (name === 'INSERT_EQUATION') {
      const editorState = this.state.editorState;
      const contentState = editorState.getCurrentContent();

			const contentStateWithEntity = contentState.createEntity(
				'EQUATION',
				'IMMUTABLE',
				{value: 'x + 3'}, // why not
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

      const stateWithContent = EditorState.set(editorState, { currentContent: newContentState });

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
