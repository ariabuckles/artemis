import React, { Component } from "react";
import { Editor, EditorState, Modifier, CompositeDecorator } from "draft-js";
import InlineMathEditor from './InlineMathEditor';

const findEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return entityKey !== null;
    },
    callback
  );
}


const ArtemisDecorator = new CompositeDecorator([
  {
    strategy: findEntities,
    component: InlineMathEditor,
  },
]);

export default ArtemisDecorator;
