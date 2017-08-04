import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DraftEditorEditHandler from 'draft-js/lib/DraftEditorEditHandler';
import asap from 'asap';

import InlineWidgetNotFoundEditor from './widgets/InlineWidgetNotFoundEditor';

const stopPropagation = (e) => e.stopPropagation();

const stopDraftEvents = {};
for (let draftEventKey of Object.keys(DraftEditorEditHandler)) {
  stopDraftEvents[draftEventKey] = stopPropagation;
}

export default class BlockWidgetEditor extends Component {

  _getWidgetStateFromProps(props) {
    const entityKey = props.block.getEntityAt(0);
    const entity = props.contentState.getEntity(entityKey);
    return {
      entityKey: entityKey,
      type: entity.getType(),
      options: entity.getData().options,
    };
  }

  state = this._getWidgetStateFromProps(this.props);

  componentWillReceiveProps(nextProps) {
    // we need to cache these things because they are by default globals,
    // so we can't test for changes in shouldComponentUpdate unless we
    // cache them ourselves.
    // It's nice to only do this work once, too.
    this.setState(this._getWidgetStateFromProps(nextProps));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      // TODO(aria): check for entityKey / type things?
      nextState.options !== this.state.options ||
      // TODO(aria): check for differences in the actual keypad.getElement()
      nextProps.keypad !== this.props.keypad
    );
  }

  _widgetOnChange = (newOptions) => {
    const options = Object.assign(
      {},
      this.state.options,
      newOptions
    );

    this.props.blockProps.onChangeElement(
      this.state.entityKey,
      { options: options }
    );
  };

  render() {
    const {
      editorWidth,
      widgetEditors,
      keypad
    } = this.props.blockProps;

    const {
      type,
      options,
    } = this.state;

    const WidgetEditor = widgetEditors[type];

    if (WidgetEditor == null) {
      return <InlineWidgetNotFoundEditor
        type={type}
      />;
    } else {
      return <div
        style={{
          maxWidth: editorWidth,
        }}
        {...stopDraftEvents}
      >
        <WidgetEditor
          {...options}
          _maxWidth={editorWidth}
          onChange={this._widgetOnChange}
          keypad={keypad}
        />
      </div>;
    }
  }
}

