import * as Draft from 'draft-js';

export const isBlockAWidgetBlock = (contentState: Draft.ContentState, block: Draft.ContentBlock) => {
  if (block.getText().length !== 1) {
    return false;
  }
  const entityKey = block.getEntityAt(0);
  if (entityKey == null) {
    return false;
  }
  const entity = contentState.getEntity(entityKey);
  const entityData = entity.getData();
  return entityData.display === 'block';
};
