import openai from "../../config/openaiConfig";
export class ImageCreatorService {
  public async createImage(prompt: string): Promise<string | undefined> {
    const result = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "256x256",
    });
    return result.data.data[0].url;
  }
}
