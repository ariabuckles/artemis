import React from 'react';
import * as Immutable from 'immutable';
import * as Aphrodite from 'aphrodite';

const styles = Aphrodite.StyleSheet.create({
  block: {
    paddingBottom: '1em',
    // make a larger area text-cursor clickable
    // especially important for deleting block widgets
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export const blockRenderMap = Immutable.Map({
  unstyled: {
    element: 'div',
    aliasedElements: ['p'],
  },
});

export const blockStyleFn = (contentBlock) => {
  const type = contentBlock.getType();
  return Aphrodite.css(styles.block);
};

