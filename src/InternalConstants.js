// Invisible separator character / zero-width comma
// This seems to be one of the few characters that has all the properties we need:
//  * sizes with letter-spacing
//  * cursor moves before and after on letter spacing
//  * text wraps (not considered whitespace for text wrapping purposes)
//  * invisible (so we can have a transparent background on the math and show the
//    highlight colour through it
//  * nice-to-have: 0 width so we don't have to do measuring hacks for letter-spacing
const ZERO_WIDTH_COMMA = '\u2063';

let WIDGET_CHAR = ZERO_WIDTH_COMMA;
let WIDGET_CHAR_COLOR = 'black';

if (typeof document !== undefined) {
  var span = document.createElement('span');
  var zwcomma = document.createTextNode(ZERO_WIDTH_COMMA);
  span.appendChild(zwcomma);
  span.style.letterSpacing = '100px';
  document.body.appendChild(span);

  console.log('span width', span.offsetWidth);
  if (span.offsetWidth !== 100) {
    WIDGET_CHAR = ',';
    WIDGET_CHAR_COLOR = 'transparent';
  }
  document.body.removeChild(span);
}

export { WIDGET_CHAR, WIDGET_CHAR_COLOR };
