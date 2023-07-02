"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCreatorRouter = void 0;
const express_1 = __importDefault(require("express"));
const typescript_ioc_1 = require("typescript-ioc");
const image_creator_controller_1 = require("./image-creator-controller");
const urlPath = "/create-image";
const router = express_1.default.Router();
exports.imageCreatorRouter = router;
const imageCreatorController = typescript_ioc_1.Container.get(image_creator_controller_1.ImageCreatorController);
router.post(urlPath, (req, res) => {
    imageCreatorController.get(req, res);
});
//# sourceMappingURL=image-creator-router.js.map