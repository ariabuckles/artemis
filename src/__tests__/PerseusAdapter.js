import * as PerseusAdapter from '../PerseusAdapter';
import * as Item1 from '../__data__/Item1';
import * as Item2 from '../__data__/Item2';

it('should convert basic static content to perseus', () => {
  const perseusData = PerseusAdapter.perseusItemFromArtemisData(Item1.artemis);
  expect(perseusData).toEqual(Item1.perseus);
});


it('should convert basic static content from perseus', () => {
  const artemisData = PerseusAdapter.artemisDataFromPerseusItem(Item1.perseus);
  expect(artemisData).toEqual(Item1.artemis);
});


it('should convert trailing letters to perseus', () => {
  const perseusData = PerseusAdapter.perseusItemFromArtemisData(Item2.artemis);
  expect(perseusData).toEqual(Item2.perseus);
});


it('should convert trailing letters from perseus', () => {
  const artemisData = PerseusAdapter.artemisDataFromPerseusItem(Item2.perseus);
  expect(artemisData).toEqual(Item2.artemis);
});

