import * as Serialization from '../Serialization';
import * as Item1 from '../__data__/Item1';

it('should serialize basic raw draft stuff', () => {
  const serialized = Serialization._serializeFromDraftRaw(Item1.draft);
  expect(serialized).toEqual(Item1.artemis);
});


it('should deserialize basic stuff to raw draft', () => {
  const deserialized = Serialization._deserializeToDraftRaw(Item1.artemis);
  expect(deserialized).toEqual(Item1.draft);
});

