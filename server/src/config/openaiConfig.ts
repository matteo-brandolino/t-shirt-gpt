import { Configuration, OpenAIApi } from "openai";
import { load } from "ts-dotenv";

const env = load({ OPENAI_API_KEY: String });

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
export default openai;
