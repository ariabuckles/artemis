import * as Draft from 'draft-js';
import Immutable from 'immutable';

// importing private draft things ;_;
const convertFromHTMLToContentBlocks = Draft.convertFromHTML;
import getSafeBodyFromHTML from 'draft-js/lib/getSafeBodyFromHTML';

import WidgetEntityHelper from './WidgetEntityHelper';

export const processHtml = (html, contentState) => {
  // We use some private parameters of convertFromHTMLToContentBlocks here,
  // hence why we're taking the draft name. Find the source/api in
  // draft-js/src/model/encoding/convertFromHTMLToContentBlocks.js
  // or draft-js/lib/model/encoding/convertFromHTMLToContentBlocks.js

  // create a memoized version of getSafeBodyFromHTML so that we can only
  // do this conversion once, and use it both for converting to draft and
  // for pulling widget entities out of
  // We promise this doesn't execute scripts because getSafeBodyFromHTML
  // doesn't execute scripts.
  let getPastedBodyCache = null;
  const getPastedBody = (html) => {
    if (getPastedBodyCache) {
      return getPastedBodyCache;
    } else {
      return getSafeBodyFromHTML(html);
    }
  };

  // we're gonna mutate this, oh yay!
  const body = getPastedBody(html);

  const widgets = []; //TODO(aria): get widgets here

  let entitiesContentState = contentState;
  let widgetEntityMap = {};
  for (const widgetInfo of widgets) {
    const insertedData = WidgetEntityHelper.createWidgetEntity(
      entitiesContentState,
      widgetInfo
    );
    entitiesContentState = insertedData.contentState;
    widgetEntityMap[insertedData.entityKey] = widgetInfo;
  }
  const entityMap = entitiesContentState.getEntityMap();

  const draftData = convertFromHTMLToContentBlocks(html, getPastedBody);
  const contentBlocks = draftData.contentBlocks;

  const fragmentContentState = Draft.ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );

  return fragmentContentState;
};

