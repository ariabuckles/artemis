import PerseusMarkdown from './lib/perseus/perseus-markdown';
import * as PerseusMarkdownOutputAdapter from './PerseusMarkdownOutputAdapter';
import * as ArtemisASTOutputter from './ArtemisASTOutputter';

export const artemisDataFromPerseusItem = (perseusItem, supportedWidgets) => {
  const content = perseusItem.question.content;
  const widgets = perseusItem.question.widgets;

  const parsed = PerseusMarkdown.parse(content);

  let outputState = {
    widgets: widgets,
    supportedWidgets: supportedWidgets,
  };

  const output = PerseusMarkdownOutputAdapter.artemisDataOutput(parsed, outputState);

  if (outputState.error) {
    console.warn(outputState.error);
    return null;
  }

  return {
    artemisVersion: 0,
    content: output,
  };
};


export const perseusItemFromArtemisData = (artemisData) => {

  let widgets = {};
  const content = ArtemisASTOutputter.perseusItemOutput(artemisData.content, {
    // modified by the output
    widgets: widgets,
  });

  return {
    question: {
      content: content,
      images: {},
      widgets: widgets,
    },
    itemDataVersion: {
      major: 0,
      minor: 1,
    },
    hints: [],
  }
};

