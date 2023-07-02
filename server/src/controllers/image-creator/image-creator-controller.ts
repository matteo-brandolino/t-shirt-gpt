import { ImageCreatorService } from "@service/image-creator-service";
import express from "express";
import { Inject } from "typescript-ioc";

export class ImageCreatorController {
  private imageCreatorService: ImageCreatorService;

  constructor(@Inject imageCreatorService: ImageCreatorService) {
    this.imageCreatorService = imageCreatorService;
  }

  public async get(req: express.Request, res: express.Response): Promise<void> {
    const result = await this.imageCreatorService.createImage(
      req.body.prompt as string
    );

    res.send(result);
  }
}
