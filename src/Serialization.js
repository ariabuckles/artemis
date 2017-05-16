import * as Draft from 'draft-js';

const serializeWidgetEntity = (entity) => {
  // TODO(aria): Be better about what to include here
  const { width, height, ...widgetInfo } = entity.data;

  return widgetInfo;
};


const deserializeWidgetEntity = (widget) => {
  return {
    type: widget.type,
    mutability: 'IMMUTABLE',
    data: widget,
  };
};


const mergeInlineRanges = (entityRanges, inlineStyleRanges) => {
  // TODO(aria): verify this works
  return entityRanges.concat(inlineStyleRanges).sort((a, b) => {
    return a.offset - b.offset;
  });
};


const createInlineThingFromRange = (text, range, entityMap) => {
  if (range.style != null) {
    return {
      type: 'text',
      style: range.style.toLowerCase(),
      content: text.slice(range.offset, range.offset + range.length),
    };
  } else if (range.key != null) {
    return {
      type: 'widget',
      info: serializeWidgetEntity(entityMap[range.key]),
    };
  } else {
    throw new Error('invalid range given to `createInlineThingFromRange`:' + JSON.stringify(range));
  }
};


const serializeBlock = (block, entityMap) => {
  const { text, type, entityRanges, inlineStyleRanges } = block;

  const ranges = mergeInlineRanges(entityRanges, inlineStyleRanges);

  let startIndex = 0;

  let inlineThings = [];

  for (const range of ranges) {
    if (range.offset !== startIndex) {
      inlineThings.push({
        type: 'text',
        style: null,
        content: text.slice(startIndex, range.offset),
      });
    }

    inlineThings.push(createInlineThingFromRange(text, range, entityMap));

    startIndex = range.offset + range.length;
  }

  if (startIndex !== text.length) {
    inlineThings.push({
      type: 'text',
      style: null,
      content: text.slice(startIndex, text.length),
    });
  }

  return inlineThings;
};


export const serialize = (artemisState) => {
  const rawDraftRepr = Draft.convertToRaw(artemisState);

  const { blocks, entityMap } = rawDraftRepr;

  const artemisRepr = blocks.map((block) => serializeBlock(block, entityMap));

  return artemisRepr;
};


export const deserialize = (artemisSerialization) => {

};


