"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const ts_dotenv_1 = require("ts-dotenv");
const env = (0, ts_dotenv_1.load)({ OPENAI_API_KEY: String });
const configuration = new openai_1.Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
exports.default = openai;
//# sourceMappingURL=openaiConfig.js.map