import * as Serialization from '../Serialization';

const A_DATA_1 = {
  "artemisVersion": 0,
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "style": null,
          "content": "if "
        },
        {
          "type": "widget",
          "info": {
            "type": "inline-math",
            "options": {
              "value": "y=x+1"
            }
          }
        }
      ]
    },
    {
      "type": "paragraph",
      "content": []
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "style": null,
          "content": "what is x?"
        }
      ]
    }
  ]
};

const D_DATA_1 = {
  "entityMap": {
    "0": {
      "type": "inline-math",
      "mutability": "IMMUTABLE",
      "data": {
        "type": "inline-math",
        "options": {
          "value": "y=x+1"
        },
      }
    }
  },
  "blocks": [
    {
      "text": "if ⁣",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 3,
          "length": 1,
          "key": 0
        }
      ],
      "data": {}
    },
    {
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "text": "what is x?",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ]
};


it('should serialize basic raw draft stuff', () => {
	const serialized = Serialization._serializeFromDraftRaw(D_DATA_1);
  expect(serialized).toEqual(A_DATA_1);
});


it('should deserialize basic stuff to raw draft', () => {
	const deserialized = Serialization._deserializeToDraftRaw(A_DATA_1);
  expect(deserialized).toEqual(D_DATA_1);
});

