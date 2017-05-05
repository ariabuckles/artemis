import React, { Component } from 'react';
import { Editor, EditorState, Modifier, CompositeDecorator } from 'draft-js';
import { InlineMathPlaceholder } from './InlineMathEditor';

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
        // TODO(aria): Change InlineMathPlaceholder to EntityRenderer that can render other
        // entities :D (and goes to InlineMathPlaceholder for equation entities)
        component: InlineMathPlaceholder,
      },
    ]);
  }
}
