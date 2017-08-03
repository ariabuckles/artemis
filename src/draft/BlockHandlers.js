import React from 'react';
import * as Immutable from 'immutable';
import * as Aphrodite from 'aphrodite';

const styles = Aphrodite.StyleSheet.create({
  block: {
    marginBottom: '1em',
  },
});

export const blockRenderMap = Immutable.Map({
  unstyled: {
    element: 'div',
    aliasedElements: ['p'],
  },
  atomic: {
    element: 'figure',
  },
});

export const blockStyleFn = (contentBlock) => {
  const type = contentBlock.getType();
  return Aphrodite.css(styles.block);
};

