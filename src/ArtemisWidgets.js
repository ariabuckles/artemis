let defaultEditorCache = null;

export const defaultEditors = () => {
  defaultEditorCache = defaultEditorCache || {
    'inline-math': require('./widgets/InlineMathEditor').default,
  };
  return defaultEditorCache;
};
