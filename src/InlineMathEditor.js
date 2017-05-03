import React, { Component } from "react";
import { View, Text, StyleSheet } from "./base-components";
import { css } from 'aphrodite';

// TODO(aria): Fix the dependency order issue here so these can be imports.
// ugh mathquill global jQuery dep
window.jQuery = require("jquery");
require("mathquill/build/mathquill.css");
require("mathquill/build/mathquill-basic.js");
const MathQuill = window.MathQuill;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddddff',
  },
  space: {
    letterSpacing: 80,
    backgroundColor: '#ddffdd',
  },
});

export default class InlineMathEditor extends Component {

  render() {
    //return <div contentEditable={false} className={css(styles.container)}><Text>[equation]</Text></div>;
    //return <Text style={styles.container}>
    return <Text style={styles.space}>{this.props.children}</Text>;
    //</Text>;
  }

}
