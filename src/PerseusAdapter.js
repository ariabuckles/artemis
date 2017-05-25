import PerseusMarkdown from './lib/perseus/perseus-markdown.jsx';
import * as PerseusMarkdownOutputAdapter from './PerseusMarkdownOutputAdapter';
import * as ArtemisASTOutputter from './ArtemisASTOutputter';

export const artemisDataFromPerseusItem = (perseusItem) => {
  const content = perseusItem.question.content;
  const widgets = perseusItem.question.widgets;

  const parsed = PerseusMarkdown.parse(content);

  const output = PerseusMarkdownOutputAdapter.artemisDataOutput(parsed, {
    widgets: widgets,
  });

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
      widgets: widgets,
    },
    itemDataVersion: {
      major: 0,
      minor: 1,
    },
    hints: [],
  }
};

