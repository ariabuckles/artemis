export const artemis = {
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


export const draft = {
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
      "text": "what is x?",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ]
};


export const perseus = {
  "question": {
    "content": "if $y=x+1$\n\nwhat is x\\?\n\n",
    "images": {},
    "widgets": {}
  },
  "itemDataVersion": {
    "major": 0,
    "minor": 1
  },
  "hints": []
};


