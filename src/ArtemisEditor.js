import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as Draft from 'draft-js';

import { View, StyleSheet } from './base-components';
import ArtemisDecorator from './ArtemisDecorator';
import * as ArtemisState from './ArtemisState';
import * as BlockHandlers from './draft/BlockHandlers';
import * as ArtemisPasteProcessor from './helpers/ArtemisPasteProcessor';
import * as PerseusAdapter from './PerseusAdapter';
import * as InternalConstants from './InternalConstants';
import InlineWidgetOverlay from './InlineWidgetOverlay';

import 'draft-js/dist/Draft.css';

if (process.env.NODE_ENV !== 'production') {
  window.convertToRaw = Draft.convertToRaw;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  debugContainer: {
    border: `1px dashed #ccc`,
  },

  editorStackingContext: {
    // defines a new stacking context so all z-indices inside are relative
    // to the editor, and the overlay remains on top of all editor components
    position: 'relative',
    zIndex: 0,
  },
});

export default class ArtemisEditor extends Component {

  componentDidMount() {
    const editorNode = ReactDOM.findDOMNode(this._editor);
    const editableDiv = editorNode.querySelector('[contenteditable=true]');
    editableDiv.addEventListener('cut', this._handleCut);
    editableDiv.addEventListener('copy', this._handleCopy);

    if (process.env.NODE_ENV !== 'production') {
      window.artemisEditor = this;
      window.serialize = () => {
        console.log(
          JSON.stringify(
            ArtemisState.serialize(this.props.editorState),
            null,
            2
          )
        );
      };
      window.deserialize = (data) => this.props.onChange(
        ArtemisState.deserialize(data)
      );
      window.loadPerseus = (perseusItem) => {
        window.deserialize(
          PerseusAdapter.artemisDataFromPerseusItem(
            perseusItem,
            this.props.widgetEditors
          )
        );
      };
      window.savePerseus = () => {
        console.log(
          JSON.stringify(
            PerseusAdapter.perseusItemFromArtemisData(
              ArtemisState.serialize(this.props.editorState)
            ),
            null,
            2
          )
        );
      }
    }
  }

  render() {
    return (
      <View style={{...styles.container, ...(this.props.debug ? styles.debugContainer : {})}}>
        <View style={styles.editorStackingContext}>
          <Draft.Editor
            spellCheck={true}
            editorState={this.props.editorState}
            onChange={this._handleDraftChange}
            blockRenderMap={BlockHandlers.blockRenderMap}
            blockStyleFn={BlockHandlers.blockStyleFn}
            placeholder={this.props.placeholder}
            handlePastedText={this._handlePastedText}
            ref={editor => { this._editor = editor; }}
          />
        </View>
        <InlineWidgetOverlay
          widgetEditors={this.props.widgetEditors}
          contentState={this.props.editorState.getCurrentContent()}
          keypad={this.props.keypad}
          onChangeElement={this._handleChangeElement}
        />
      </View>
    );
  }

  _handleCut = e => {
    const { editorState } = this.props;
    const html = ArtemisPasteProcessor.getAlternativeCopyHtml(editorState);
    if (html) {
      e.clipboardData.setData('text/plain', InternalConstants.WIDGET_CHAR);
      e.clipboardData.setData('text/html', html);
      e.preventDefault();

      const newContentState = Draft.Modifier.removeRange(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        'backward' // TODO(aria): Not sure if we need anything specific here
      );
      return this.props.onChange(
        Draft.EditorState.push(editorState, newContentState, 'remove-range')
      );
    }
  };

  _handleCopy = e => {
    const { editorState } = this.props;
    const html = ArtemisPasteProcessor.getAlternativeCopyHtml(editorState);
    if (html) {
      e.clipboardData.setData('text/plain', InternalConstants.WIDGET_CHAR);
      e.clipboardData.setData('text/html', html);
      e.preventDefault();
    }
  };

  _handleDraftChange = newEditorState => {
    // NOTE: This disables native optimizations so we can remeasure
    // equation/widget overlays on every keystroke
    // NOTE: We're also doing this on every cursor change. SORRY.
    return this.props.onChange(
      Draft.EditorState.set(newEditorState, {
        nativelyRenderedContent: null,
      })
    );
  };

  _handlePastedText = (text: string, html: string, editorState: any) => {
    const newEditorState = ArtemisState.pasteHtml(editorState, html);
    this.props.onChange(newEditorState);
    return true;
  };

  _handleChangeElement = (key, data, updateSize) => {
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

    // TODO(aria): undo stack stuff here?
    return this.props.onChange(Draft.EditorState.set(editorState, updates));
  };

}
