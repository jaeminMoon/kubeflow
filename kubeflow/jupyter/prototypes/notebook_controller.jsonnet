// @apiVersion 0.1
// @name io.ksonnet.pkg.notebook-controller
// @description notebook controller
// @shortDescription notebooks
// @param name string Name
// @optionalParam controllerImage string gcr.io/kubeflow-images-public/notebook-controller:v20190214-v0.4.0-rc.1-142-ge7e38b0f-dirty-73cae0 The image to use for the notebook controller

local notebooks = import "kubeflow/jupyter/notebook_controller.libsonnet";
local instance = notebooks.new(env, params);
instance.list(instance.all)
