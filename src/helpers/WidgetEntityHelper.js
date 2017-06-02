import * as Draft from 'draft-js';

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



