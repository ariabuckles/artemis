import * as Draft from 'draft-js';
import ArtemisDecorator from './ArtemisDecorator';

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
      // This character is just a space so our letter spacing is closer to the correct width ouo:
      // Invisible separator character.
      // This seems to be one of the few characters that has all the properties we need:
      //  * sizes with letter-spacing
      //  * cursor moves before and after on letter spacing
      //  * text wraps (not considered whitespace for text wrapping purposes)
      //  * invisible (so we can have a transparent background on the math and show the
      //    highlight colour through it
      //  * nice-to-have: 0 width so we don't have to do measuring hacks for letter-spacing
      '\u2063',
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
    return "could not find action: " + JSON.stringify(action);
  }
};
