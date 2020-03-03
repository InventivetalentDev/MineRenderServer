const gl = require("gl");
const pngStream = require('three-png-stream');
const {createCanvas, loadImage, Image, Canvas} = require("canvas");


module.exports.getOptionsFromReq = function (req, res, def) {
    let optionHeader = req.headers["minerender-options"] || "{}";
    try {
        optionHeader = JSON.parse(optionHeader);
    }catch (e) {
        res.status(400).json({error: "invalid JSON in option header"});
        return;
    }
    let options = Object.assign({}, def, optionHeader);

    options.sendStats = false;
    options.pauseHidden = false;
    options.controls = {
        enabled: false,
        zoom: false,
        rotate: false,
        pan: false,
        keys: false
    };

    return options;
};

module.exports.getDataFromReq = function (req, res,  key, def) {
    let dataHeader = req.headers["minerender-" + key] || "{}";
    try {
        dataHeader = JSON.parse(dataHeader);
    }catch (e) {
        res.status(400).json({error: "invalid JSON in data header"});
        return;
    }
    return Object.assign({}, def, dataHeader);
};

module.exports.makeNewRenderer = function (width, height) {
    let context = gl(64, 64, {preserveDrawingBuffer: true});
    let canvas = createFakeCanvas(64, 64);
    canvas.getContext = function getContext(x) {
        return context;
    };


    console.log("context: " + context);

    let renderer = new THREE.WebGLRenderer({context: context, canvas: canvas, antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 0);

    return renderer;
};

module.exports.createFakeElement = function () {
    let element = {};
    element.appendChild = function (child) {
        console.log("appendChild");
        console.log(child);
        this.appendedChild = child;
    };
    element.dispatchEvent = function (event) {
        console.log("dispatchEvent");
        console.log(event);
    };
    return element;
};

module.exports.sendRenderToRes = function (render, renderer, target, req, res) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader("X-Minerender-Options", JSON.stringify(render.options));
    pngStream(renderer, target).pipe(res);
};

module.exports.isObjectEmpty = function(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};


 function createFakeCanvas(w, h) {
    let c = createCanvas(w, h);
    c.addEventListener = function (event, func, bind_) {
    };
    c.style = {
        width: w,
        height: h
    };
    let _getContext = c.getContext;
    c.getContext = function (type, attributes) {
        console.log("getContext(" + type + ")")
        if (type === "webgl") {
            return gl(w, h, {preserveDrawingBuffer: true});
        }
        return _getContext.call(this, type, attributes);
    };
    return c;
}
module.exports.createFakeCanvas =createFakeCanvas;

function createFakeImg() {
    let img = new Image();
    img.addEventListener = function (event, func, bind_) {
        if (event === "load") {
            img.onload = function () {
                func.call(img);
            };
        }
        if (event === "error") {
            img.onerror = function (err) {
                func.call(img, err);
            };
        }
    };
    img.removeEventListener = function (event, func, bind_) {
    };
    return img;
}
module.exports.createFakeImg =createFakeImg;
