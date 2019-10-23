const helpers = require("../helpers");

require("minerender/dist/gui");

module.exports = function (express, config) {
    let router = express.Router();


    router.get("/:type(item|block)/:model", function (req, res) {
        let options = helpers.getOptionsFromReq(req, {
            width: 1024,
            height: 1024,

            camera: {
                type: "perspective",
                x: 35,
                y: 25,
                z: 20,
                target: [0, 0, 0]
            },
        });

        let element = helpers.createFakeElement();
        let renderer = helpers.makeNewRenderer(options.width, options.height);
        options.canvas={
            width: options.width,
            height:options.height
        };

        let models=[{
            type:req.params.type,
            model: req.params.model
        }]

        console.log(window);
        let render = new window.ModelRender(options, element);

        console.log(models);
        render.render(models, function () {
            let target = new THREE.WebGLRenderTarget(options.width, options.height);
            renderer.render(render._scene, render._camera, target);

            helpers.sendRenderToRes(render,renderer, target, req, res);
        });


    });


    return router;
};