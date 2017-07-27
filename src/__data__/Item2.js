export const artemis = {
  "artemisVersion": 0,
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "style": null,
          "content": "Yhat is the distance between points "
        },
        {
          "type": "widget",
          "info": {
            "type": "inline-math",
            "options": {
              "value": "(11, 9)"
            }
          }
        },
        {
          "type": "text",
          "style": null,
          "content": " and  "
        },
        {
          "type": "widget",
          "info": {
            "type": "inline-math",
            "options": {
              "value": "(3, 3)"
            }
          }
        },
        {
          "type": "text",
          "style": null,
          "content": " on the coordinate plane? y"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "widget",
          "info": {
            "type": "numeric-input",
            "options": {
              "static": false,
              "answers": [
                {
                  "value": 10,
                  "status": "correct",
                  "message": "",
                  "simplify": "required",
                  "strict": false,
                  "maxError": null
                }
              ],
              "size": "normal",
              "coefficient": false,
              "labelText": ""
            }
          }
        }
      ]
    }
  ]
};


export const perseus ={
  "question": {
    "content": "Yhat is the distance between points $(11, 9)$ and  $(3, 3)$ on the coordinate plane\\? y\n\n[[☃ numeric-input 1]]\n\n",
    "images": {},
    "widgets": {
      "numeric-input 1": {
        "type": "numeric-input",
        "options": {
          "static": false,
          "answers": [
            {
              "value": 10,
              "status": "correct",
              "message": "",
              "simplify": "required",
              "strict": false,
              "maxError": null
            }
          ],
          "size": "normal",
          "coefficient": false,
          "labelText": ""
        },
        "graded": true
      }
    }
  },
  "itemDataVersion": {
    "major": 0,
    "minor": 1
  },
  "hints": []
};

