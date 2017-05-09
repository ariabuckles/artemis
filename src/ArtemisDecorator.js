import React, { Component } from 'react';
import { Editor, EditorState, Modifier, CompositeDecorator } from 'draft-js';
import InlineWidgetPlaceholder from './InlineWidgetPlaceholder';

const findEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey !== null;
  }, callback);
};

export default class ArtemisDecorator extends CompositeDecorator {
  constructor() {
    super([
      {
        strategy: findEntities,
        component: InlineWidgetPlaceholder,
      },
    ]);
  }
}
