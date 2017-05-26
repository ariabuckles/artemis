/**
 * A simple-markdown style outputter for perseus data
 *
 * Given an artemis data tree, outputs a perseus-markdown string and widgets
 * object
 */
import SimpleMarkdown from 'simple-markdown';

const perseusDataFor = (outputFunc) => {
  const nestedOutput = (ast, state) => {
    state = state || {};
    state.usedWidgetIds = state.usedWidgetIds || {};

    if (Array.isArray(ast)) {
      return ast.map(function(node) {
        return nestedOutput(node, state);
      }).join("");
    } else {
      return outputFunc(ast, nestedOutput, state);
    }
  };
  return nestedOutput;
};


// Stolen from part of simple-markdown's text rule
const ESCAPE_CHAR_REGEX = /[^0-9A-Za-z\s\u00c0-\uffff]/g;

// Stolen from perseus/util.js
const SNOWMAN = '\u2603';


// artemis node rules, converting to perseus ast nodes
const rules = {
  paragraph: {
    perseus: (node, output, state) => {
      return output(node.content, state) + '\n\n';
    },
  },

  text: {
    perseus: (node, output, state) => {
      // We need to escape all non-alphanumericish characters because they may be
      // simple-markdown special characters :o
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
      // for the magick $& we're using here, which inserts the matched portion
      // of the string
      return node.content.replace(ESCAPE_CHAR_REGEX, '\\$&');
    },
  },

  widget: {
    perseus: (node, output, state) => {
      const widgetInfo = node.info;
      const type = widgetInfo.type;

      if (type === 'inline-math') {
        // katex inline math
        return '$' + widgetInfo.options.value + '$';

      } else {
        // normal perseus widget
        const num = (state.usedWidgetIds[type] || 0) + 1;
        state.usedWidgetIds[type] = num;
        const widgetId = `${type} ${num}`;

        state.widgets[widgetId] = Object.assign(
          {},
          widgetInfo,
          { graded: true }
        );
        return '[[' + SNOWMAN + ' ' + widgetId + ']]';
      }
    },
  },
};


export const perseusItemOutput = perseusDataFor(
  SimpleMarkdown.ruleOutput(rules, 'perseus')
);
