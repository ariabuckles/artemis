export const newInlineMath = () => {
  return {
    type: 'INSERT_WIDGET',
    payload: {
      type: 'inline-math',
      options: {
        value: '',
      },
    },
  };
};

export const insertWidget = (type, display) => {
  return {
    type: 'INSERT_WIDGET',
    payload: {
      type: type,
      display: display || 'inline',
      options: { },
    },
  };
};
