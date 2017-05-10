import * as Draft from 'draft-js';
import InlineWidgetPlaceholder from './InlineWidgetPlaceholder';

const findEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey !== null;
  }, callback);
};

export default class ArtemisDecorator extends Draft.CompositeDecorator {
  constructor() {
    super([
      {
        strategy: findEntities,
        component: InlineWidgetPlaceholder,
      },
    ]);
  }
}
