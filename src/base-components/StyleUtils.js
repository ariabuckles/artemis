import { css } from 'aphrodite';

const _combineClassNames = (className1, className2) => {
  if (className1 && className2) {
    return className1 + ' ' + className2;
  } else if (className2) {
    return className2;
  } else {
    return className1;
  }
};

const _recurseAddStyles = (toStaticStyleArray, toDynamicStyleObj, styles) => {
  if (styles == null) {
    return false;
  } else if (Array.isArray(styles)) {
    let didGetRawStyles = false;
    for (const style of styles) {
      didGetRawStyles = didGetRawStyles || _recurseAddStyles(
        toStaticStyleArray,
        toDynamicStyleObj,
        style
      );
    }
    return didGetRawStyles;
  } else if (styles._name && styles._definition) {
    toStaticStyleArray.push(styles);
    return false;
  } else {
    Object.assign(toDynamicStyleObj, styles);
    return true;
  }
};

// Combines aphrodite and dynamic styles
// TODO(aria): get the order overriding right
export const stylesToAphrodite = (className, styles) => {
  let styleArray = [];
  let styleObj = {};
  const didGetRawStyles = _recurseAddStyles(styleArray, styleObj, styles);
  return {
    className: _combineClassNames(className, css.apply(null, styleArray)),
    style: didGetRawStyles ? styleObj : null,
  };
};
