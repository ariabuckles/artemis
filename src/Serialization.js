import * as Draft from 'draft-js';
import * as InternalConstants from './InternalConstants';

const CURRENT_ARTEMIS_VERSION = 0;

const EMPTY_ARTEMIS_DATA = {
  artemisVersion: CURRENT_ARTEMIS_VERSION,
};

const EMPTY_ARTEMIS_BLOCK = {
  type: 'paragraph',
  content: [],
};

const serializeWidgetEntity = (entity) => {
  // TODO(aria): Be better about what to include here
  const { width, height, ...widgetInfo } = entity.data;

  return widgetInfo;
};


const deserializeWidgetEntity = (widgetInfo) => {
  return {
    type: widgetInfo.type,
    mutability: 'IMMUTABLE',
    data: widgetInfo,
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

  let blockContent = [];

  for (const range of ranges) {
    if (range.offset !== startIndex) {
      blockContent.push({
        type: 'text',
        style: null,
        content: text.slice(startIndex, range.offset),
      });
    }

    blockContent.push(createInlineThingFromRange(text, range, entityMap));

    startIndex = range.offset + range.length;
  }

  if (startIndex !== text.length) {
    blockContent.push({
      type: 'text',
      style: null,
      content: text.slice(startIndex, text.length),
    });
  }

  return {
    // TODO(aria): use a better type here? maybe type: text subtype: unstyled?
    type: 'paragraph',
    content: blockContent,
  };
};


export const _serializeFromDraftRaw = (rawDraftRepr) => {
  const { blocks, entityMap } = rawDraftRepr;

  let artemisBlocks = blocks.map((block) => serializeBlock(block, entityMap));

  // remove empty blocks from the end:
  for (let i = artemisBlocks.length - 1; i >= 0; i--) {
    const block = artemisBlocks[i];
    if (block.type === 'paragraph' && block.content.length === 0) {
      artemisBlocks.pop();
    } else {
      break;
    }
  }

  return {
    artemisVersion: CURRENT_ARTEMIS_VERSION,
    content: artemisBlocks,
  };
};

export const serialize = (artemisState) => {
  return _serializeFromDraftRaw(Draft.convertToRaw(artemisState));
};


const getArtemisBlocksFromContent = (content) => {
  if (content == null || content.length == 0) {
    return [EMPTY_ARTEMIS_BLOCK];
  } else {
    return content;
  }
};


const deserializeBlock = (artemisBlock, /* mutated */ entityMap) => {

  if (artemisBlock.type === 'paragraph') {
    let text = '';
    let inlineStyleRanges = [];
    let entityRanges = [];

    for (const contentPiece of artemisBlock.content) {
      const type = contentPiece.type;

      if (type === 'text') {
        text += contentPiece.content;
      } else if (type === 'widget') {
        const widgetInfo = contentPiece.info;
        const newEntityKey = entityMap.length;

        entityRanges.push({
          key: newEntityKey,
          length: 1,
          offset: text.length,
        });

        text += InternalConstants.WIDGET_CHAR;

        entityMap.push(deserializeWidgetEntity(widgetInfo));
      } else {
        throw new Error(`contentPiece type '${type}' not supported`);
      }
    }

    // return the draftjs version of this raw block.
    return {
      type: 'unstyled',
      text: text,
      depth: 0,
      inlineStyleRanges: inlineStyleRanges,
      entityRanges: entityRanges,
      // block metadata
      data: {},
    };

  } else {
    throw new Error('non paragraph blocks not yet supported sowwy~');
  }
};


export const _deserializeToDraftRaw = (artemisSerialization = EMPTY_ARTEMIS_DATA) => {

  const artemisVersion = artemisSerialization.artemisVersion;

  if (artemisVersion != CURRENT_ARTEMIS_VERSION) {
    throw new Error(
      'loading other versions of artemis data is not yet supported, sorry <3'
    );
  }

  const artemisBlocks = getArtemisBlocksFromContent(artemisSerialization.content);

  let entityMap = [];
  let draftBlocks = artemisBlocks.map((artemisBlock) => {
    return deserializeBlock(artemisBlock, entityMap);
  });

  const rawDraftRepr = {
    blocks: draftBlocks,
    // remove the array properties of entityMap to match the draft raw API
    entityMap: Object.assign({}, entityMap),
  };

  return rawDraftRepr;
};


export const deserialize = (artemisSerialization) => {
  return Draft.convertFromRaw(_deserializeToDraftRaw(artemisSerialization));
};


