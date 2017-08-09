import * as Draft from 'draft-js';
import ArtemisDecorator from './ArtemisDecorator';
import * as Serialization from './Serialization';
import * as InternalConstants from './InternalConstants';
import * as ArtemisPasteProcessor from './helpers/ArtemisPasteProcessor';
import * as InsertionHelper from './helpers/InsertionHelper';
import * as WidgetEntityHelper from './helpers/WidgetEntityHelper';
import * as Immutable from 'immutable';

export const empty = () => {
  return Draft.EditorState.createEmpty(new ArtemisDecorator());
};


const _insertInlineWidget = (editorState, widgetInfo) => {
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

// Atomic blocks keep giving us errors in draft, so i'm going
// with a simple inline widget again for now

const _insertBlockWidget = (editorState, widgetInfo) => {
  const contentState = editorState.getCurrentContent();

  const {
    contentState: contentStateWithEntity,
    entityKey,
  } = WidgetEntityHelper.createWidgetEntity(contentState, widgetInfo);

  const currSelection = editorState.getSelection();
  const newContentState = Draft.Modifier.replaceWithFragment(
    contentStateWithEntity,
    currSelection,
    Draft.BlockMapBuilder.createFromArray([
      new Draft.ContentBlock({
        key: Draft.genKey(),
        type: 'unstyled',
        text: '',
        characterList: Immutable.List(),
      }),
      new Draft.ContentBlock({
        key: Draft.genKey(),
        type: 'unstyled',
        text: InternalConstants.WIDGET_CHAR,
        characterList: Immutable.List.of(Draft.CharacterMetadata.create({
          entity: entityKey,
        })),
        // TODO(aria): we shouldn't need this anymore, since we test
        // for a block being a widget block based on its entity info
        /*data: Immutable.Map({
          widget: true,
        }),*/
      }),
      // put in an empty block afterwards?
      // TODO(aria): only do this if it's the last block.
      new Draft.ContentBlock({
        key: Draft.genKey(),
        type: 'unstyled',
        text: '',
        characterList: Immutable.List(),
      })
    ])
  );

  const stateWithChange = Draft.EditorState.push(
    editorState,
    newContentState,
    'insert-fragment'
  );

  return stateWithChange;

};
/*const _insertBlockWidget = (editorState, widgetInfo) => {
  const contentState = editorState.getCurrentContent();

  const {
    contentState: contentStateWithEntity,
    entityKey,
  } = WidgetEntityHelper.createWidgetEntity(contentState, widgetInfo);

  const stateWithContent = Draft.EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });

  const stateWithWidgetBlock = Draft.AtomicBlockUtils.insertAtomicBlock(
    stateWithContent,
    entityKey,
    InternalConstants.WIDGET_CHAR
  );

  return stateWithWidgetBlock;
};*/

export const insertWidget = (editorState, widgetInfo) => {
  // TODO(aria): develop a better system for managing widget display
  // preferences, and for inserting newlines around them if need be
  if (widgetInfo.display === 'block' || widgetInfo.type === 'image') {
    return _insertBlockWidget(editorState, widgetInfo);
  } else {
    return _insertInlineWidget(editorState, widgetInfo);
  }
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
  const fragmentBlockMap = ArtemisPasteProcessor.processHtml(html, contentState);
  const newEditorState = InsertionHelper.insertFragment(
    artemisState,
    fragmentBlockMap
  );
  return newEditorState;
};


export const serialize = Serialization.serialize;

export const deserialize = Serialization.deserialize;

