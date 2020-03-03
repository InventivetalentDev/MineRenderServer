// const ModelRender = require("minerender/lib/model");
//
// let modelRender = new ModelRender();
// let modelConverter = new ModelConverter();
// modelConverter.structureToModels({
//     url:"https://assets.mcasset.cloud/1.13/data/minecraft/structures/end_city/ship.nbt"
// },function (models) {
//     console.log(models)
//     modelRender.render(models,function () {
//         console.log("rendered!")
//     })
// });

const fs = require("fs");
const path = require("path");
const {createCanvas, loadImage, Image, Canvas} = require("canvas");
const gl = require("gl");
const pngStream = require('three-png-stream');
const {createFakeCanvas, createFakeImg, cacheKey} = require("./routes/helpers");
const crypto = require("crypto");
// Stuff to trick Minerender into thinking it's in a browser
global.Image = Image;
global.THREE = require("three");
global.jQuery = require("jquery");
global.XMLHttpRequest = require("xhr2");
global.fetch = require("node-fetch");
global.btoa = require("btoa");
global.atob = require("atob");

const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const config = require("./config");
const port = process.env.PORT || config.port || 3043;

global.window = {
    innerWidth: 1920,
    innerHeight: 1080,
    document: {
        createElement: function (type) {
            console.log("createElement(" + type + ")")
            if (type === "canvas") {
                return createFakeCanvas(64, 64);
            }
            if (type === "img") {
                return createFakeImg();
            }
            throw new Error("#createElement only supported for 'canvas' and 'img' (called for " + type + ")");
        },
        createElementNS: function (ns, type) {
            console.log("createElementNS(" + type + ")")
            if (type === "canvas") {
                return createFakeCanvas(64, 64);
            }
            if (type === "img") {
                return createFakeImg();
            }
            throw new Error("#createElementNS only supported for 'canvas' and 'img' (called for " + type + ")");
        }
    },
    navigator: {},
    addEventListener: function (event, func, bind_) {
    },
    requestAnimationFrame: function () {
        // disabled, since we're using a custom render call
    }
};
global.document = global.window.document;
global.navigator = global.window.navigator;// set navigator, as THREE for some reason checks that for VR or whatever
global.requestAnimationFrame = window.requestAnimationFrame;

global.CustomEvent = function (name, data) {
    this.name = name;
    this.data = data;
};


function errorCatcher(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack);
    res.status(500);
    res.json({msg: "Something went wrong trying to render your request!"});
}

function cache(req, res, next) {
    let key = cacheKey(req);
    res.setHeader("ETag", key);
    let file = path.join( "cache", key + ".png");
    console.log(file);
    let birthtime;
    if (fs.existsSync(file) && (Date.now() - (birthtime=fs.statSync(file)["birthtimeMs"]) < 8.64e+7/*1day*/)) {
        console.log("cache: true");
        res.setHeader("X-Cached", true);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader("Last-Modified", new Date(birthtime));
        res.setHeader("Cache-Control","max-age=86400");
        let content = fs.readFileSync(file);
        res.send(content);
        return;
    } else {
        console.log("cache: false");
        res.setHeader("X-Cached", false);
        next();
        fs.unlinkSync(file);
    }
}

app.use(errorCatcher);
app.use(cache);

app.use("/render/skin", require("./routes/render/skin")(express, config));
app.use("/render/model", require("./routes/render/model")(express, config));


server.listen(port, function () {
    console.log('listening on *:' + port);
});
