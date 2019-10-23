const helpers = require("../helpers");

require("minerender/dist/model");

const DEF_OPTIONS={
   canvas:{
       width: 512,
       height: 512,
   },

    camera: {
        type: "perspective",
        x: 35,
        y: 25,
        z: 20,
        target: [0, 0, 0]
    },
};

module.exports = function (express, config) {
    let router = express.Router();


    /**
     * @api {get} /render/model/:type(item|block)/:model ModelRenderSimple
     * @apiName ModelRenderSimple
     * @apiGroup ModelRender
     * @apiDescription Render a simple Block/Item model -See https://docs.minerender.org/class/src/model/index.js~ModelRender.html
     * @apiHeader {Object} minerender-options Render-Options
     *
     * @apiParam {String} type either 'item' or 'block'
     * @apiParam {String} model model to render
     */
    router.get("/:type(item|block)/:model", function (req, res) {
        let options = helpers.getOptionsFromReq(req, res, DEF_OPTIONS);
        if (!options) return;

        let element = helpers.createFakeElement();
        let renderer = helpers.makeNewRenderer(options.canvas.width, options.canvas.height);

        let models=[{
            type:req.params.type,
            model: req.params.model
        }]

        console.log(window);
        let render = new window.ModelRender(options, element);

        console.log(models);
        render.render(models, function () {
            let target = new THREE.WebGLRenderTarget(options.canvas.width, options.canvas.height);
            renderer.render(render._scene, render._camera, target);

            helpers.sendRenderToRes(render,renderer, target, req, res);
        });


    });


    return router;
};