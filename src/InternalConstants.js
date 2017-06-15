// Invisible separator character / zero-width comma
// This seems to be one of the few characters that has all the properties we need:
//  * sizes with letter-spacing
//  * cursor moves before and after on letter spacing
//  * text wraps (not considered whitespace for text wrapping purposes)
//  * invisible (so we can have a transparent background on the math and show the
//    highlight colour through it
//  * nice-to-have: 0 width so we don't have to do measuring hacks for letter-spacing
export const WIDGET_CHAR = '\u2063';
