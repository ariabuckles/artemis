import React, { Component } from "react";
import { EditorBlock } from "draft-js";
import { View, Text, StyleSheet } from "./base-components";

export default class ArtemisEditorBlock extends Component {

  render() {
    return <View>
      <EditorBlock {...this.props} />
    </View>;
  }

}
