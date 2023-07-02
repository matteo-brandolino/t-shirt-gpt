"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageCreatorService = void 0;
const openaiConfig_1 = __importDefault(require("../../config/openaiConfig"));
class ImageCreatorService {
    createImage(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield openaiConfig_1.default.createImage({
                prompt: prompt,
                n: 1,
                size: "256x256",
                response_format: "b64_json",
            });
            const photoBase64 = result.data.data[0].b64_json;
            return `data:image/png;base64,${photoBase64}`;
        });
    }
}
exports.ImageCreatorService = ImageCreatorService;
//# sourceMappingURL=image-creator-service.js.map