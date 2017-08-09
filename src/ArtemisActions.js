import * as WidgetEntityHelper from './helpers/WidgetEntityHelper';

export const newInlineMath = () => {
  return {
    type: 'INSERT_WIDGET',
    payload: WidgetEntityHelper.createEmptyWidgetInfo('inline-math'),
  };
};

export const insertWidget = (type) => {
  return {
    type: 'INSERT_WIDGET',
    payload: WidgetEntityHelper.createEmptyWidgetInfo(type),
  };
};

