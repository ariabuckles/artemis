// input-number
// Just transforms to a numeric-input on load

const _answerFormInfos = {
  number: {
    forms: ['integer', 'decimal', 'proper', 'improper', 'mixed'],
    strict: true,
  },
  decimal: {
    forms: ["decimal"],
    strict: true,
  },
  integer: {
    forms: ["integer"],
    strict: true,
  },
  rational: {
    forms: ["integer", "proper", "improper", "mixed"],
    strict: true,
  },
  improper: {
    forms: ["integer", "proper", "improper"],
    strict: true,
  },
  mixed: {
    forms: ["integer", "proper", "mixed"],
    strict: true,
  },
  percent: {
    forms: ["percent"],
    strict: false,
  },
  pi: {
    forms: ["pi"],
    strict: false,
  },
};

const _getAnswerForOptions = (options) => {

  const answerFormInfo = (
    _answerFormInfos[options.answerForm] || _answerFormInfos.number
  );

  return {
    value: options.value,
    status: 'correct',
    message: '',
    simplify: options.simplify,
    answerForms: answerFormInfo.forms,
    strict: answerFormInfo.strict,
    maxError: options.inexact ? options.maxError : null,
  };
};

export default {
  editor: null,
  // Just transforms to a numeric-input on load
  upgrade: (widgetInfo) => {

    const answer = _getAnswerForOptions(widgetInfo.options);

    return {
      type: 'numeric-input',
      options: {
        answers: [answer],
        size: 'normal',
        coefficient: false,
        labelText: '',
      },
    };
  },
};
