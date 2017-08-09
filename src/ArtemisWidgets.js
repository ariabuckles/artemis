let defaultEditorCache = null;

export const defaultEditors = () => {
  defaultEditorCache = defaultEditorCache || {
    'image': require('./widgets/ImageEditor').default,
    'inline-math': require('./widgets/InlineMathEditor').default,
    'input-number': require('./widgets/InputNumberEditor').default,
    'numeric-input': require('./widgets/NumericInputEditor').default,
    'radio': require('./widgets/Radio').default,
  };
  return defaultEditorCache;
};
