import * as Draft from 'draft-js';
import Immutable from 'immutable';

// importing private draft things ;_;
const convertFromHTMLToContentBlocks = Draft.convertFromHTML;
import getSafeBodyFromHTML from 'draft-js/lib/getSafeBodyFromHTML';

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
  let getBodyFromHtmlCache = null;
  const getBodyFromHtml = (html) => {
    if (getBodyFromHtmlCache) {
      return getBodyFromHtmlCache;
    } else {
      return getSafeBodyFromHTML(html);
    }
  };

  const body = getBodyFromHtml(html);

  const draftData = convertFromHTMLToContentBlocks(html, getBodyFromHtml);
  const contentBlocks = draftData.contentBlocks;

  const entityMap = Immutable.OrderedMap();

  const fragmentContentState = Draft.ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );

  return fragmentContentState;
};

