import React, { Component } from 'react';

import '../FontAwesome';
import { View, StyleSheet } from '../base-components';

import Popover from '../helpers/Popover';

import '../lib/perseus/perseus-css';
import PerseusRadioEditor from '../lib/perseus/widgets/radio/editor';
import {
  widget as PerseusRadio,
  transform as PerseusRadioTransform
} from '../lib/perseus/widgets/radio';
const apiOptions = require("../lib/perseus/api-options-stub");

const styles = StyleSheet.create({
  radio: {
    display: 'flex',
    minWidth: 100,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderColor: 'rgb(186, 190, 194)',
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 100,
    padding: '6px 6px 1px',
    textAlign: 'center',
    color: 'black',
  },

  editor: {
    color: '#444444',
    backgroundColor: 'white',
    border: `2px solid #4FAED1`,
    borderRadius: 5,
    margin: 8,
    padding: 10,
  },
});

const EDITOR_PAD_WIDTH = 16;

export default class ImageEditor extends Component {

  constructor(props) {
    super(props);
    const perseusEditorProps = {
      ...PerseusRadioEditor.defaultProps,
      ...props,
    };
    this.state = {
      perseusEditorProps: perseusEditorProps,
      widgetProps: PerseusRadioTransform(perseusEditorProps),
    };

  }

  componentWillReceiveProps(nextProps) {
    const perseusEditorProps = {
      ...PerseusRadioEditor.defaultProps,
      ...nextProps,
    };
    this.setState({
      perseusEditorProps: perseusEditorProps,
      widgetProps: PerseusRadioTransform(perseusEditorProps),
    });
  }

  _changeWidgetDisplay = (newOptions) => {
    this.setState({
      widgetProps: {...this.state.widgetProps, ...newOptions},
    });
  };

  render() {

    return <Popover>
      <View className="framework-perseus" style={styles.radio}>
        {/* responsive false because we have no size info in artemis
            overlays */}
        <PerseusRadio
          {...this.state.widgetProps}
          apiOptions={apiOptions}
          _clampWidth={this.props._maxWidth - EDITOR_PAD_WIDTH}
          onChange={this._changeWidgetDisplay}
          trackInteraction={() => {}}
          />
      </View>
      <View className="framework-perseus" style={styles.editor}>
        <PerseusRadioEditor
          {...this.state.perseusEditorProps}
          apiOptions={apiOptions}
          onChange={this.props.onChange}
        />
      </View>
    </Popover>;
  }
}

