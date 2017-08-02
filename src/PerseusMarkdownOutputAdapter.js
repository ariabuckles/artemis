/**
 * A simple-markdown style outputter for artemis data
 *
 * Given a perseus-markdown tree, this outputs an artemis data tree ^_^
 *
 * "Everything is just simple-markdown on the inside" ~ Oliver
 */
import SimpleMarkdown from 'simple-markdown';

export const preprocess = (source) => {
  const mdSource = SimpleMarkdown.preprocess(source);
  return mdSource;
};

const addToResult = (result, prevResult, nodeResult) => {
  if (Array.isArray(nodeResult)) {
    for (const nodeResultItem of nodeResult) {
      prevResult = addToResult(result, prevResult, nodeResultItem);
    }
    return prevResult;
  } else if (nodeResult == null || nodeResult.type == null) {
    // do not push onto the result
    // set the type to null for prevNodeResult checks
    return { type: null };

  } else if (nodeResult.type === 'text' && prevResult.type === 'text' &&
      nodeResult.style === prevResult.style){
    // Hacks to combine text nodes.
    // Mostly for simplicity of testing, this isn't strictly required
    // TODO(aria): apologize more
    prevResult.content += nodeResult.content;
    return prevResult;

  } else {
    result.push(nodeResult);
    return nodeResult;
  }
};

const artemisDataFor = (outputFunc) => {
  const nestedOutput = (ast, state) => {
    state = state || {};
    state.style = state.style || null;

    if (Array.isArray(ast)) {
      let result = [];

      let prevNodeResult = {};
      ast.forEach((node) => {
        let nodeResult = nestedOutput(node, state);
        prevNodeResult = addToResult(result, prevNodeResult, nodeResult);
      });

      return result;
    } else {
      return outputFunc(ast, nestedOutput, state);
    }
  };
  return nestedOutput;
};


const importWidgetInfo = (widgetInfo, widgetId, outputState) => {
  const type = widgetInfo.type;

  if (outputState.supportedWidgets && !outputState.supportedWidgets[type]) {
    outputState.error = {
      message: "Widget type not supported",
      widgetId: widgetId,
    };
    return null;
  }

  const isStatic = widgetInfo.static || widgetInfo.graded == false;
  if (isStatic && type !== 'image') {
    outputState.error = {
      message: "Static or ungraded non-images are not supported",
      widgetId: widgetId,
    };
    return null;
  }

  return {
    type: widgetInfo.type,
    options: widgetInfo.options,
  };
};


// perseus-markdown ast rules, converting to artemis nodes
const rules = {
  paragraph: {
    artemis: (node, output, state) => {
      return {
        type: 'paragraph',
        content: output(node.content, state),
      };
    }
  },

  text: {
    artemis: (node, output, state) => {
      return {
        type: 'text',
        style: state.style,
        content: node.content
      };
    }
  },

  math: {
    artemis: (node, output, state) => {
      return {
        type: "widget",
        info: {
          type: "inline-math",
          options: {
            "value": node.content,
          },
        },
      };
    }
  },

  blockMath: {
    artemis: (node, output, state) => {
      return {
        type: 'paragraph',
        content: [{
          type: "widget",
          info: {
            type: "inline-math",
            options: {
              "value": node.content,
            },
          },
        }],
      };
    }
  },

  unescapedDollar: {
    artemis: (node, output, state) => {
      return {
        type: 'text',
        style: state.style,
        content: '$',
      };
    }
  },

  hr: {
    artemis: (node, output, state) => {
      // weird/hacky
      return {
        type: 'paragraph',
        content: [{
          type: 'text',
          style: null,
          content: '~ ~ ~ ~ ~ ~ ~ ~ ~',
        }],
      };
    },
  },

  heading: {
    artemis: (node, output, state) => {
      return {
        type: 'paragraph',
        content: output(node.content, state),
      };
    },
  },

  codeBlock: {
    artemis: (node, output, state) => {
      // get rid of alt text for now :(
      // TODO(aria): accessibility support
      if (node.lang === 'alt') {
        return null;
      } else {
        return {
          type: 'paragraph',
          content: [{
            type: 'text',
            style: null,
            content: node.content,
          }],
        };
      }
    },
  },

  link: {
    artemis: (node, output, state) => {
      return output(node.content).concat({
        type: 'text',
        style: state.style,
        content: ': ' + node.target,
      });
    },
  },

  newline: {
    artemis: () => null,
  },

  em: {
    artemis: (node, output, state) => {
      // TODO(aria): support nesting styles
      // TODO(aria): customize which styles are supported
      return output(node.content, Object.assign({}, state, { style: 'italic' }));
    }
  },

  strong: {
    artemis: (node, output, state) => {
      // TODO(aria): support nesting styles
      return output(node.content, Object.assign({}, state, { style: 'bold' }));
    }
  },

  u: {
    artemis: (node, output, state) => {
      // TODO(aria): support nesting styles
      return output(node.content, Object.assign({}, state, { style: 'underline' }));
    }
  },

  del: {
    artemis: (node, output, state) => {
      // TODO(aria): support strikethrough
      return null;
    }
  },

  br: {
    artemis: () => null,
  },

  image: {
    artemis: (node, output, state) => {
      return {
        type: 'widget',
        info: {
          type: 'image',
          options: {
            backgroundImage: {
              url: node.target,
              // TODO(aria): pass through the values in images{} to here
              width: undefined,
              height: undefined,
            },
            alt: node.alt,
            title: node.title,
          },
        },
      };
    },
  },

  // we don't yet support:
  // * lists
  // * tables
  // * blockQuotes
  list: {
    artemis: (node, output, state) => {
      state.error = {
        message: "Lists are not supported yet"
      };
      return null;
    },
  },
  table: {
    artemis: (node, output, state) => {
      state.error = {
        message: "Tables are not supported yet"
      };
      return null;
    },
  },
  blockQuote: {
    artemis: (node, output, state) => {
      state.error = {
        message: "Blockquotes are not supported yet"
      };
      return null;
    },
  },

  widget: {
    artemis: (node, output, state) => {
      const id = node.id;
      const widget = state.widgets[id];

      return {
        type: 'widget',
        info: importWidgetInfo(widget, id, state),
      };
    }
  },
};


export const artemisDataOutput = artemisDataFor(
  SimpleMarkdown.ruleOutput(rules, 'artemis')
);

