const gl = require("gl");
const pngStream = require('three-png-stream');

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
    let renderer = new THREE.WebGLRenderer({context: gl(1, 1, {preserveDrawingBuffer: true}), antialias: true});
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
    pngStream(renderer, target).pipe(res);
};

module.exports.isObjectEmpty = function(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}