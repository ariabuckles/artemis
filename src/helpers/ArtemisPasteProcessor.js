import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as Draft from 'draft-js';
import Immutable from 'immutable';

// importing private draft things ;_;
const convertFromHTMLToContentBlocks = Draft.convertFromHTML;
import getSafeBodyFromHTML from 'draft-js/lib/getSafeBodyFromHTML';

import * as WidgetEntityHelper from './WidgetEntityHelper';
import * as InternalConstants from '../InternalConstants';

// Unicode for 'not a character'. Also cannot be part of a
// surrogate pair yay
const TEMP_WIDGET_CHAR = '\uffff'; // unicode 'not a character'
const TEMP_WIDGET_CHARS_R = new RegExp(TEMP_WIDGET_CHAR, 'g');

export const processHtml = (html, contentState) => {
  // We use some private parameters of convertFromHTMLToContentBlocks here,
  // hence why we're taking the draft name. Find the source/api in
  // draft-js/src/model/encoding/convertFromHTMLToContentBlocks.js
  // or draft-js/lib/model/encoding/convertFromHTMLToContentBlocks.js

  // we're gonna mutate this, oh yay!
  const body = getSafeBodyFromHTML(html);
  const widgetNodes = body.querySelectorAll('[data-artemis-widget-info]');

  let entitiesContentState = contentState;
  let widgetEntityMap = {};
  let widgetKeys = [];
  for (const widgetNode of widgetNodes) {
    const widgetInfo = JSON.parse(
      widgetNode.getAttribute('data-artemis-widget-info')
    );

    const insertedData = WidgetEntityHelper.createWidgetEntity(
      entitiesContentState,
      widgetInfo
    );
    entitiesContentState = insertedData.contentState;

    // change the widget ID to match our new widget ID so that this
    // is parsed properly by draft's convertFromHTMLToContentBlocks
    widgetNode.setAttribute('data-artemis-id', insertedData.entityKey);
    // replace text with a unique char here so that we can detect it below
    // without using WIDGET_CHAR, which varies depending on browser, and
    // also may be a character in the pasted text
    widgetNode.textContent = TEMP_WIDGET_CHAR;
    widgetKeys.push(insertedData.entityKey);

  }
  const entityMap = entitiesContentState.getEntityMap();

  // replace getSafeBodyFromHTML with our mutated dom tree so that we:
  // (a) do this conversion once, and use it both for converting to draft
  // and for pulling widget entities out of
  // and (b) we maintain our mutations from above
  // We promise this doesn't execute scripts because getSafeBodyFromHTML
  // doesn't execute scripts.
  const draftData = convertFromHTMLToContentBlocks(html, () => body);

  // Add entity annotations to our content blocks
  let widgetIndex = 0;
  const contentBlocks = draftData.contentBlocks.map((block) => {
    const chars = block.getText();

    // replace both the char metadatas and the text characters
    let newChars = null;
    const newCharDatas = block.getCharacterList().withMutations((charDatas) => {

      newChars = chars.replace(TEMP_WIDGET_CHARS_R, (match, index) => {

        const widgetKey = widgetKeys[widgetIndex++];
        if (widgetKey == null) {
          return;
        }

        const charMetadata = charDatas.get(index);
        const newCharMetadata = Draft.CharacterMetadata.applyEntity(
          charMetadata,
          widgetKey
        );

        charDatas.set(index, newCharMetadata);

        return InternalConstants.WIDGET_CHAR;
      });
    });

    const newBlock = block.
      set('text', newChars).
      set('characterList', newCharDatas);
    return newBlock;
  });

  const fragmentBlockMap = Draft.BlockMapBuilder.createFromArray(
    contentBlocks
  );

  return fragmentBlockMap;
};


export const getSelectedWidgets = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();

  const startKey = selection.getStartKey();
  const startOffset = selection.getStartOffset();
  const endKey = selection.getEndKey();
  const endOffset = selection.getEndOffset();

  const blockMap = contentState.getBlockMap();

  let widgetList = [];
  blockMap.slice(startKey, endKey).forEach((block, blockKey) => {
    const chars = block.getCharacterList();
    let startIndex = 0;
    let endIndex = chars.size;
    if (blockKey === startKey) {
      startIndex = startOffset;
    }
    if (blockKey === endKey) {
      endIndex = endOffset;
    }

    for (const charMetadata of chars.slice(startIndex, endIndex)) {
      const entityKey = charMetadata.getEntity();
      if (entityKey) {
        const entity = contentState.getEntity(entityKey);
        const widgetInfo = WidgetEntityHelper.widgetInfoFromEntity(entity);
        if (widgetInfo) {
          widgetList.push(widgetInfo);
        }
      }
    }
  });

  return widgetList;
};


/**
 * Returns alternative html to be copied in the case of a single widget
 * being selected, because by default chrome only copies the actual
 * character, without any of the metadata in the wrapping spans D:
 */
export const getAlternativeCopyHtml = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();

  const startKey = selection.getStartKey();
  const startOffset = selection.getStartOffset();
  const endKey = selection.getEndKey();
  const endOffset = selection.getEndOffset();

  if (startKey !== endKey || endOffset !== startOffset + 1) {
    // this is a normal multi-character selection. default copy-paste works ok
    return null;
  }

  const block = contentState.getBlockForKey(startKey);
  const chars = block.getCharacterList();
  const charMetadata = chars.get(startOffset);
  const entityKey = charMetadata.getEntity();
  if (entityKey == null) {
    return null;
  }

  const entity = contentState.getEntity(entityKey);
  const widgetInfo = WidgetEntityHelper.widgetInfoFromEntity(entity);
  if (widgetInfo == null) {
    return null;
  }

  return ReactDOMServer.renderToStaticMarkup(
    <span data-artemis-widget-info={JSON.stringify(widgetInfo)}>
      {InternalConstants.WIDGET_CHAR}
    </span>
  );
};
