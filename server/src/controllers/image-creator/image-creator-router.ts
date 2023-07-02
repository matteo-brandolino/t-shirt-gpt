import express from "express";
import { Container } from "typescript-ioc";
import { ImageCreatorController } from "./image-creator-controller";

const urlPath = "/create-image";

const router = express.Router();

const imageCreatorController = Container.get(ImageCreatorController);

router.post(urlPath, (req, res) => {
  imageCreatorController.get(req, res);
});

export { router as imageCreatorRouter };
