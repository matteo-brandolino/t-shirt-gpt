import openai from "../../config/openaiConfig";
export class ImageCreatorService {
  public async createImage(prompt: string): Promise<string | undefined> {
    const result = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    });
    const photoBase64 = result.data.data[0].b64_json;
    return `data:image/png;base64,${photoBase64}`;
  }
}
