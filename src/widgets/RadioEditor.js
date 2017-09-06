import React, { Component } from 'react';

import '../FontAwesome';
import { Text, View, StyleSheet } from '../base-components';

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
    minWidth: 380,
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderColor: 'rgb(186, 190, 194)',
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 100,
    padding: '6px 6px 1px',
    color: 'black',
  },

  editor: {
    color: '#444444',
    width: 380,
    maxHeight: 500,
    overflowY: 'scroll',
    backgroundColor: 'white',
    border: `2px solid #4FAED1`,
    borderRadius: 5,
    margin: 8,
    padding: 10,
  },

  inputError: {
    borderColor: '#ea933e',
    color: '#ea933e',
  },
  error: {
    background: '#ea933e',
    padding: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  errorText: {
    color: 'white'
  }
});

const EDITOR_PAD_WIDTH = 16;

class RadioEditor extends Component {

  constructor(props) {
    super(props);
    const perseusEditorProps = {
      ...PerseusRadioEditor.defaultProps,
      ...props,
    };
    this.state = {
      perseusEditorProps: perseusEditorProps,
      widgetProps: PerseusRadioTransform(perseusEditorProps, Math.round(Math.random() * 100)),
    };

  }

  componentWillReceiveProps(nextProps) {
    const perseusEditorProps = {
      ...PerseusRadioEditor.defaultProps,
      ...nextProps,
    };
    this.setState({
      perseusEditorProps: perseusEditorProps,
      widgetProps: PerseusRadioTransform(perseusEditorProps, Math.round(Math.random() * 100)),
    });
  }

  _changeWidgetDisplay = (newOptions) => {
    this.setState({
      widgetProps: {...this.state.widgetProps, ...newOptions},
    });
  };

  render() {
    const hasError = this._hasError();
    return <Popover>
      <View className="framework-perseus" style={[styles.radio, hasError && styles.inputError]}>
        {/* responsive false because we have no size info in artemis
            overlays */}
        <PerseusRadio
          {...this.state.widgetProps}
          apiOptions={apiOptions}
          onChange={this._changeWidgetDisplay}
          trackInteraction={() => {}}
          />
      </View>
      <View className="framework-perseus" style={styles.editor}>
        {hasError && <View style={styles.error}>
          <Text style={styles.errorText}>
            No correct answer specified!
          </Text>
        </View>}
        <PerseusRadioEditor
          {...this.state.perseusEditorProps}
          apiOptions={{...apiOptions, isMobile: false}}
          onChange={this.props.onChange}
        />
      </View>
    </Popover>;
  }
  _hasError = () => {
    const answers = this.props.choices;
    if (!answers || answers.length === 0) {
      return true;
    }
    let hasCorrect = false;
    answers.forEach(answer => {
      hasCorrect = hasCorrect || (answer && answer.correct &&
        answer.content != null && answer.content != "");
    });
    return !hasCorrect;
  }
}


export default {
  editor: RadioEditor,
  upgrade: (widgetInfo) => {
    // disable randomization
    return {...widgetInfo,
      options: {...widgetInfo.options,
        randomize: false,
      },
    };
  },
};
