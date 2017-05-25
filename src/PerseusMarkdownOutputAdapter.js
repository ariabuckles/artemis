import SimpleMarkdown from 'simple-markdown';

const artemisDataFor = (outputFunc) => {
  const nestedOutput = (ast, state) => {
    state = state || {};
    state.style = state.style || null;

    if (Array.isArray(ast)) {
      let result = [];

      let prevNodeResult = {};
      ast.forEach((node) => {
        let nodeResult = nestedOutput(node, state);

        if (Array.isArray(nodeResult)) {
          Array.prototype.push.apply(result, nodeResult);

          // Hacks to combine text nodes.
          // Mostly for simplicity of testing, this isn't strictly required
          // TODO(aria): apologize more

        } else if (nodeResult == null || nodeResult.type == null) {
          // do not push onto the results
          // set the type to null for prevNodeResult checks
          nodeResult = { type: null };

        } else if (nodeResult.type === 'text' && prevNodeResult.type === 'text' &&
            nodeResult.style === prevNodeResult.style){
          prevNodeResult.content += nodeResult.content;

        } else {
          result.push(nodeResult);
        }

        prevNodeResult = nodeResult;
      });

      return result;
    } else {
      return outputFunc(ast, nestedOutput, state);
    }
  };
  return nestedOutput;
};


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
      throw new Error('images not yet supported');
    },
  },

  // we don't yet support:
  // * lists
  // * tables
  // * blockQuotes
  // * images

  widget: {
    artemis: (node, output, state) => {
      const id = node.id;
      const widget = state.widgets[id];

      return {
        type: 'widget',
        info: {
          type: widget.type,
          options: widget.options,
        },
      };
    }
  },
};


export const artemisDataOutput = artemisDataFor(
  SimpleMarkdown.ruleOutput(rules, 'artemis')
);

