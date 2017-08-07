import React from 'react';

module.exports = {
  isArticle: false,
  isMobile: true,
  satStyling: false,
  onInputError: function() { },
  onFocusChange: function() { },
  staticRender: false,
  GroupMetadataEditor: () => null, //StubTagEditor, // TODO(aria): hope not to use this
  showAlignmentOptions: false,
  readOnly: false,
  groupAnnotator: function() { return null; },
  baseElements: {
    Link: (props) => {
      return <a {...props} />;
    },
  },
  setDrawingAreaAvailable: function() { },
  useDraftEditor: false,
};
