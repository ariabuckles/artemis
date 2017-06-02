import * as Draft from 'draft-js';
import ArtemisDecorator from './ArtemisDecorator';
import * as Serialization from './Serialization';
import * as InternalConstants from './InternalConstants';
import * as ArtemisPasteProcessor from './helpers/ArtemisPasteProcessor';
import * as InsertionHelper from './helpers/InsertionHelper';
import * as WidgetEntityHelper from './helpers/WidgetEntityHelper';

export const empty = () => {
  return Draft.EditorState.createEmpty(new ArtemisDecorator());
};


export const insertWidget = (editorState, widgetInfo) => {
  const contentState = editorState.getCurrentContent();

  const {
    contentState: contentStateWithEntity,
    entityKey,
  } = WidgetEntityHelper.createWidgetEntity(contentState, widgetInfo);

  const currSelection = editorState.getSelection();
  const newContentState = Draft.Modifier.replaceText(
    contentStateWithEntity,
    currSelection,
    InternalConstants.WIDGET_CHAR,
    null,
    entityKey
  );

  // TODO(aria): push an instance onto the undoStack here.
  // See EditorState.push (which we can't actually use cause
  // its change types are limited yuck)
  const stateWithContent = Draft.EditorState.set(editorState, {
    currentContent: newContentState,
  });

  // build up a new selection just after the equation we inserted
  // TODO(aria): we might want this to select the equation instead?
  // TODO(aria): merge this with the above EditorState.set?
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
};


export const applyAction = (artemisState, action) => {
  const editorState = artemisState;
  const type = action.type;

  if (type === 'INSERT_WIDGET') {
    const widgetInfo = action.payload;
    return insertWidget(editorState, widgetInfo);

  } else {
    return 'could not find action: ' + JSON.stringify(action);
  }
};


export const pasteHtml = (artemisState, html) => {
  const contentState = artemisState.getCurrentContent();
  const fragmentContentState = ArtemisPasteProcessor.processHtml(html, contentState);
  const newEditorState = InsertionHelper.insertFragment(
    artemisState,
    fragmentContentState
  );
  return newEditorState;
};


export const serialize = Serialization.serialize;

export const deserialize = Serialization.deserialize;

