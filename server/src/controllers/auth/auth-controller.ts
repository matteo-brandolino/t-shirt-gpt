import { AuthService } from "@service/auth-service";
import express from "express";
import { UrlManager } from "@utils/url-manager";
import { Inject } from "typescript-ioc";

export class AuthController {
  private authService: AuthService;

  constructor(@Inject authService: AuthService) {
    this.authService = authService;
  }

  public async get(req: express.Request, res: express.Response): Promise<void> {
    const strategy: string = new UrlManager(req.path).getStrategyFromPath();

    this.authService.setStrategy(strategy as string);

    await this.authService.executeStrategy(req, res);
  }
}
