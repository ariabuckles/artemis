import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import asap from 'asap';

import InlineWidgetNotFoundEditor from './widgets/InlineWidgetNotFoundEditor';

export default class BlockWidgetEditor extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.options !== this.props.options ||
      // TODO(aria): check for differences in the actual keypad.getElement()
      nextProps.keypad !== this.props.keypad
    );
  }

  _widgetOnChange = (newOptions) => {
    const entityKey = this.props.block.getEntityAt(0);
    const entity = this.props.contentState.getEntity(entityKey);
    const entityData = entity.getData();

    const options = Object.assign(
      {},
      entityData.options,
      newOptions
    );

    this.props.blockProps.onChangeElement(
      entityKey,
      { options: options }
    );
  };

  render() {
    const {
      editorWidth,
      widgetEditors,
      keypad
    } = this.props.blockProps;

    const entityKey = this.props.block.getEntityAt(0);
    const entity = this.props.contentState.getEntity(entityKey);
    const entityData = entity.getData();

    const type = entity.getType();
    const options = entityData.options;

    const WidgetEditor = widgetEditors[type];

    if (WidgetEditor == null) {
      return <InlineWidgetNotFoundEditor
        type={type}
      />;
    } else {
      return <div style={{
        maxWidth: editorWidth,
      }}>
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

