import * as Draft from 'draft-js';

// TODO(aria): figure out a more permanent method of storing display
// for now it's just inferred :/
// it probably is fine to just store it on the widget info, but we're
// ignoring that right now for perseus ease of compatibility and
// ease of future compatibility with artemis.
// change it to a widgetInfo thing once we're ready for that
// permanence :D
const defaultDisplayForWidget = {
  radio: 'block',
};


export const createEmptyWidgetInfo = (type) => {
  return {
    type: type,
    display: defaultDisplayForWidget[type] || 'inline',
    width: null,
    height: null,
    options: {},
  };
};

export const widgetInfoFromEntity = (entity) => {
  // we don't use immutable record getters here because we
  // might be getting json, and so we need to access the raw
  // data property (or data get attribute for a record)
  const entityData = entity.data;

  // check that it's a widget, not a link or other odd entity
  // TODO(aria): This is hacky
  if (entityData == null || entityData.type !== entity.type) {
    return null;
  }

  // TODO(aria): Be better about what to include here
  const { width, height, display, ...widgetInfo } = entityData;

  return widgetInfo;
};


export const entityFromWidgetInfo = (widgetInfo) => {
  const type = widgetInfo.type;
  if (defaultDisplayForWidget[type]) {
    widgetInfo = {
      ...widgetInfo,
      display: defaultDisplayForWidget[type],
    };
  }
  return {
    type: type,
    mutability: 'IMMUTABLE',
    data: widgetInfo,
  };
};


export const createWidgetEntity = (contentState, widgetInfo) => {
  const type = widgetInfo.type;
  if (defaultDisplayForWidget[type]) {
    widgetInfo = {
      ...widgetInfo,
      display: defaultDisplayForWidget[type],
    };
  }
  const contentStateWithEntity = contentState.createEntity(
    type,
    'IMMUTABLE',
    widgetInfo
  );

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  return {
    contentState: contentStateWithEntity,
    entityKey: entityKey,
  };
};

