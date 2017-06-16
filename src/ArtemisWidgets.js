let defaultEditorCache = null;

export const defaultEditors = () => {
  defaultEditorCache = defaultEditorCache || {
    'image': require('./widgets/ImageEditor').default,
    'inline-math': require('./widgets/InlineMathEditor').default,
    'numeric-input': require('./widgets/NumericInputEditor').default,
  };
  return defaultEditorCache;
};
