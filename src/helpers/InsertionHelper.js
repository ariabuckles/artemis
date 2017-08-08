import * as Draft from 'draft-js';

import type {Map} from 'immutable';

// Modified from draft-js/src/component/handlers/edit/editOnPaste.js

export function insertFragment(
  editorState: Draft.EditorState,
  fragmentBlockMap: Map<string, Draft.ContentBlock>
): EditorState {
  const newContent = Draft.Modifier.replaceWithFragment(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    fragmentBlockMap
  );

  return Draft.EditorState.push(
    editorState,
    newContent,
    'insert-fragment',
  );
};

