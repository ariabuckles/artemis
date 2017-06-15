import * as Draft from 'draft-js';

export const widgetInfoFromEntity = (entity) => {
  // we don't use getters here because we might be getting json
  const entityData = entity.data;

  // check that it's a widget, not a link or other odd entity
  // TODO(aria): This is hacky
  if (entityData == null || entityData.type !== entity.type) {
    return null;
  }

  // TODO(aria): Be better about what to include here
  const { width, height, ...widgetInfo } = entityData;

  return widgetInfo;
};


export const entityFromWidgetInfo = (widgetInfo) => {
  return {
    type: widgetInfo.type,
    mutability: 'IMMUTABLE',
    data: widgetInfo,
  };
};


export const createWidgetEntity = (contentState, widgetInfo) => {
  const contentStateWithEntity = contentState.createEntity(
    widgetInfo.type,
    'IMMUTABLE',
    widgetInfo
  );

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  return {
    contentState: contentStateWithEntity,
    entityKey: entityKey,
  };
};



