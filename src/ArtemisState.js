import * as Draft from 'draft-js';
import ArtemisDecorator from './ArtemisDecorator';
import * as Serialization from './Serialization';
import * as InternalConstants from './InternalConstants';

export const empty = () => {
  return Draft.EditorState.createEmpty(new ArtemisDecorator());
};

export const applyAction = (artemisState, action) => {
  const editorState = artemisState;
  const contentState = editorState.getCurrentContent();
  const type = action.type;

  // TODO(aria): make action an object
  if (type === 'INSERT_WIDGET') {
    const widgetInfo = action.payload;

    const contentStateWithEntity = contentState.createEntity(
      widgetInfo.type,
      'IMMUTABLE',
      widgetInfo
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const currSelection = editorState.getSelection();
    const newContentState = Draft.Modifier.replaceText(
      contentStateWithEntity,
      currSelection,
      InternalConstants.WIDGET_CHAR,
      null,
      entityKey
    );

    const stateWithContent = Draft.EditorState.set(editorState, {
      currentContent: newContentState,
    });

    // build up a new selection just after the equation we inserted
    // TODO(aria): we might want this to select the equation instead?
    const stateWithSelection = Draft.EditorState.acceptSelection(
      stateWithContent,
      new Draft.SelectionState({
        anchorKey: currSelection.getStartKey(),
        anchorOffset: currSelection.getStartOffset() + 1,
        focusKey: currSelection.getEndKey(),
        focusOffset: currSelection.getStartOffset() + 1,
        isBackward: false,
        hasFocus: false,
      })
    );

    return stateWithSelection;
  } else {
    return 'could not find action: ' + JSON.stringify(action);
  }
};


export const serialize = Serialization.serialize;

export const deserialize = Serialization.deserialize;

