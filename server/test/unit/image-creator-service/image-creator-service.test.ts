import { assert } from "chai";
import { ImageCreatorService } from "@service/image-creator-service";
import { Container } from "typescript-ioc";

const imageCreatorService = Container.get(ImageCreatorService);

describe("ImageCreatorService Tests", () => {
  it("should create an image", async () => {
    const prompt = "Create a beautiful image";

    const imageUrl = await imageCreatorService.createImage(prompt);

    assert.isDefined(imageUrl);
  }).timeout(25000);

  it("should create an image and the result should be a string", async () => {
    const prompt = "Create a landscape image";

    const imageUrl = await imageCreatorService.createImage(prompt);

    assert.isString(imageUrl);
  }).timeout(25000);
});
