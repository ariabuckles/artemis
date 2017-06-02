import * as Draft from 'draft-js';

// Modified from draft-js/src/component/handlers/edit/editOnPaste.js

export function insertFragment(
  editorState: Draft.EditorState,
  fragmentContentState: Draft.ContentState,
): EditorState {
  const newContent = Draft.Modifier.replaceWithFragment(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    fragmentContentState.getBlockMap(),
  );

  // once newContent.getEntityMap() returns and OrderedMap, we can
  // replace the following with this:
  //const mergedEntityMap = newContent.getEntityMap().merge(
  //  fragmentContentState.getEntityMap()
  //);
  const mergedEntityMap = fragmentContentState.getEntityMap();
  if (mergedEntityMap !== newContent.getEntityMap()) {
    throw new Error('merged entity maps incorrectly; check whether draft ' +
      'has removed DraftEntity and this should be replaced with OrderedMap::merge'
    );
  }

  return Draft.EditorState.push(
    editorState,
    newContent.set('entityMap', mergedEntityMap),
    'insert-fragment',
  );
};

