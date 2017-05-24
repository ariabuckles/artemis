import SimpleMarkdown from 'simple-markdown';

const artemisDataFor = (outputFunc) => {
  const nestedOutput = (ast, state) => {
    state = state || {};

    if (Array.isArray(ast)) {
      let result = [];

      let prevNodeResult = {};
      ast.forEach((node) => {
        const nodeResult = nestedOutput(node, state);
        if (Array.isArray(nodeResult)) {
          Array.prototype.push.apply(result, nodeResult);

          // Hacks to combine text nodes.
          // Mostly for simplicity of testing, this isn't strictly required
          // TODO(aria): apologize more
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
        style: null,
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

