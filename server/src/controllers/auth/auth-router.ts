import express from "express";
import { Container } from "typescript-ioc";
import { AuthController } from "./auth-controller";

type UrlPaths = {
  post: string[];
  get: string[];
};
type method = keyof UrlPaths;

const urlPaths = {
  post: ["/signup", "/login", "/logout", "/refresh"],
  get: ["/verify-email/:token"],
};

const router = express.Router();

const authController = Container.get(AuthController);

Object.keys(urlPaths).forEach((method) => {
  if (method === "post") {
    urlPaths[method as method].forEach((urlPath) => {
      router.post(urlPath, (req, res) => {
        authController.get(req, res);
      });
    });
  }
  if (method === "get") {
    urlPaths[method as method].forEach((urlPath) => {
      router.get(urlPath, (req, res) => {
        authController.get(req, res);
      });
    });
  }
});

export { router as authRouter };
