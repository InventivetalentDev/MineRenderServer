define({ "api": [
  {
    "type": "get",
    "url": "/render/model/:type(item|block)/:model",
    "title": "ModelRenderSimple",
    "name": "ModelRenderSimple",
    "group": "ModelRender",
    "description": "<p>Render a simple Block/Item model -See https://docs.minerender.org/class/src/model/index.js~ModelRender.html</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "Object",
            "optional": false,
            "field": "minerender-options",
            "description": "<p>Render-Options</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>either 'item' or 'block'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "model",
            "description": "<p>model to render</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/render/model.js",
    "groupTitle": "ModelRender"
  },
  {
    "type": "get",
    "url": "/render/skin/",
    "title": "SkinRenderFull",
    "name": "SkinRenderFull",
    "group": "SkinRender",
    "description": "<p>Render a Skin model with more texture options - See https://docs.minerender.org/class/src/skin/index.js~SkinRender.html</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "Object",
            "optional": false,
            "field": "minerender-options",
            "description": "<p>Render-Options</p>"
          },
          {
            "group": "Header",
            "type": "Object",
            "optional": false,
            "field": "minerender-skin",
            "description": "<p>Skin-Options</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/render/skin.js",
    "groupTitle": "SkinRender"
  },
  {
    "type": "get",
    "url": "/render/skin/:texture",
    "title": "SkinRenderSimple",
    "name": "SkinRenderSimple",
    "group": "SkinRender",
    "description": "<p>Render a simple Skin model - See https://docs.minerender.org/class/src/skin/index.js~SkinRender.html</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "Object",
            "optional": false,
            "field": "minerender-options",
            "description": "<p>Render-Options</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "texture",
            "description": "<p>Texture</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/render/skin.js",
    "groupTitle": "SkinRender"
  }
] });
