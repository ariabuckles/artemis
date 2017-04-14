import React, { Component } from "react";
import { Editor, EditorState } from "draft-js";
import { View, Text, StyleSheet } from "./base-components";

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
      editorState: EditorState.createEmpty(),
    };

    this._handleDraftChange = this._handleDraftChange.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Editor editorState={this.state.editorState} onChange={this._handleDraftChange} />
      </View>
    );
  }

  _handleDraftChange(newEditorState) {
    this.setState({ editorState: newEditorState });
  }
}
