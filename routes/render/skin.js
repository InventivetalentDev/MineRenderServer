const helpers = require("../helpers");

require("minerender/dist/skin");

const DEF_OPTIONS = {
    canvas: {
        width: 550,
        height: 750,
    },

    camera: {
        type: "perspective",
        x: 20,
        y: 35,
        z: 20,
        target: [0, 18, 0]
    },
};

module.exports = function (express, config) {
    let router = express.Router();


    /**
     * @api {get} /render/skin/ SkinRenderFull
     * @apiName SkinRenderFull
     * @apiGroup SkinRender
     * @apiDescription Render a Skin model with more texture options - See https://docs.minerender.org/class/src/skin/index.js~SkinRender.html
     *
     * @apiHeader {Object} minerender-options Render-Options
     * @apiHeader {Object} minerender-skin Skin-Options - see https://docs.minerender.org/class/src/skin/index.js~SkinRender.html#instance-method-render
     *
     */
    router.get("/", function (req, res) {
        let options = helpers.getOptionsFromReq(req, res, DEF_OPTIONS);
        console.log(options);
        if (!options) return;
        let skin = helpers.getDataFromReq(req, res, "skin", {});
        console.log(skin);
        if (!skin) return;
        if (helpers.isObjectEmpty(skin)) {
            res.status(400).json({error: "Missing minrender-skin header data"});
            return;
        }

        let element = helpers.createFakeElement();
        let renderer = helpers.makeNewRenderer(options.canvas.width, options.canvas.height);

        let render = new window.SkinRender(options, element);

        render.render(skin, function () {
            let target = new THREE.WebGLRenderTarget(options.canvas.width, options.canvas.height);
            renderer.render(render._scene, render._camera, target);

            helpers.sendRenderToRes(render, renderer, target, req, res);
        });
    });

    /**
     * @api {get} /render/skin/:texture SkinRenderSimple
     * @apiName SkinRenderSimple
     * @apiGroup SkinRender
     * @apiDescription Render a simple Skin model - See https://docs.minerender.org/class/src/skin/index.js~SkinRender.html
     * @apiHeader {Object} minerender-options Render-Options
     *
     *
     * @apiParam {String} texture Texture (Playername/UUID/Base64/URL)
     */
    router.get("/:texture", function (req, res) {
        let options = helpers.getOptionsFromReq(req,res, DEF_OPTIONS);
        if (!options) return;

        let element = helpers.createFakeElement();
        let renderer = helpers.makeNewRenderer(options.canvas.width, options.canvas.height);

        let render = new window.SkinRender(options, element);

        render.render(req.params.texture, function () {
            let target = new THREE.WebGLRenderTarget(options.canvas.width, options.canvas.height);
            renderer.render(render._scene, render._camera, target);

            helpers.sendRenderToRes(render, renderer, target, req, res);
        });


    });


    return router;
};