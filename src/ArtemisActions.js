
export const newInlineMath = () => {
  return {
    type: 'INSERT_WIDGET',
    payload: {
      type: 'inline-math',
    },
  };
};
