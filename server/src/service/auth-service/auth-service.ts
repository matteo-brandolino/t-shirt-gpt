import type { Request, Response } from "express";
import httpStatus from "http-status";
import { randomUUID } from "crypto";
import * as argon2 from "argon2";
import prismaClient from "../../config/prisma";

import type {
  TypedRequest,
  UserLoginCredentials,
  UserSignUpCredentials,
} from "../../types/types";
import config from "../../config/config";
import transporter from "../../config/nodemailer";
import logger from "../../middleware/logger";
import { clearRefreshTokenCookieConfig } from "../../config/cookieConfig";
import jwt from "jsonwebtoken";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { sign } = jwt;

interface Strategy {
  execute(
    req: TypedRequest<UserSignUpCredentials> | Request,
    res: Response
  ): Response | Promise<any>;
}

class Login implements Strategy {
  createRefreshToken = (userId: number | string): string => {
    return sign({ userId }, config.jwt.refresh_token.secret, {
      expiresIn: config.jwt.refresh_token.expire,
    });
  };
  createAccssToken = (userId: number | string): string => {
    return sign({ userID: userId }, config.jwt.access_token.secret, {
      expiresIn: config.jwt.access_token.expire,
    });
  };
  async execute(req: TypedRequest<UserLoginCredentials>, res: Response) {
    const cookies = req.cookies;

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Email and password are required!" });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

    // check if email is verified
    if (!user.emailVerified) {
      res.status(httpStatus.UNAUTHORIZED).json({
        message: "Your email is not verified! Please confirm your email!",
      });
    }

    // check password
    try {
      if (await argon2.verify(user.password, password)) {
        // if there is a refresh token in the req.cookie, then we need to check if this
        // refresh token exists in the database and belongs to the current user than we need to delete it
        // if the token does not belong to the current user, then we delete all refresh tokens
        // of the user stored in the db to be on the safe site
        // we also clear the cookie in both cases
        if (cookies?.[config.jwt.refresh_token.cookie_name]) {
          // check if the given refresh token is from the current user
          const checkRefreshToken = await prismaClient.refresh_token.findUnique(
            {
              where: {
                token: cookies[config.jwt.refresh_token.cookie_name],
              },
            }
          );

          // if this token does not exists int the database or belongs to another user,
          // then we clear all refresh tokens from the user in the db
          if (!checkRefreshToken || checkRefreshToken.userId !== user.id) {
            await prismaClient.refresh_token.deleteMany({
              where: {
                userId: user.id,
              },
            });
          } else {
            // else everything is fine and we just need to delete the one token
            await prismaClient.refresh_token.delete({
              where: {
                token: cookies[config.jwt.refresh_token.cookie_name],
              },
            });
          }

          // also clear the refresh token in the cookie
          res.clearCookie(
            config.jwt.refresh_token.cookie_name,
            clearRefreshTokenCookieConfig
          );
        }

        const accessToken = this.createAccssToken(user.id);

        const newRefreshToken = this.createRefreshToken(user.id);

        // store new refresh token in db
        await prismaClient.refresh_token.create({
          data: {
            token: newRefreshToken,
            userId: user.id,
          },
        });

        // save refresh token in cookie
        res.cookie(
          config.jwt.refresh_token.cookie_name,
          newRefreshToken,
          clearRefreshTokenCookieConfig
        );

        // send access token per json to user so it can be stored in the localStorage
        return res.json({ accessToken });
      } else {
        return res.status(httpStatus.UNAUTHORIZED);
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
class Signup implements Strategy {
  async execute(req: TypedRequest<UserSignUpCredentials>, res: Response) {
    const { username, email, password } = req.body;

    // check req.body values
    if (!username || !email || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Username, email and password are required!",
      });
    }

    const checkUserEmail = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUserEmail) return res.sendStatus(httpStatus.CONFLICT);

    try {
      const hashedPassword = await argon2.hash(password);

      const newUser = await prismaClient.user.create({
        data: {
          name: username,
          email,
          password: hashedPassword,
        },
      });
      console.log(newUser);

      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 3600000);

      await prismaClient.email_verification_token.create({
        data: {
          token,
          expiresAt,
          userId: newUser.id,
        },
      });

      new VerifyEmail().sendResetEmail(email, token);

      res.status(httpStatus.CREATED).json({ message: "New user created" });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
class VerifyEmail implements Strategy {
  sendResetEmail(email: string, token: string) {
    const verifyLink = `${config.server.url}/api/auth/verify-email/${token}`;
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Email verification",
      html: `Please click <a href="${verifyLink}">here</a> to verify your email.`,
    };
    console.log(verifyLink);
    transporter?.sendMail(
      mailOptions,
      (error: any, info: { response: string }) => {
        if (error) {
          logger.error(error);
        } else {
          logger.info("Verify email sent: " + info.response);
        }
      }
    );
  }
  async execute(req: Request, res: Response) {
    const { token } = req.params;

    if (!token) return res.sendStatus(httpStatus.NOT_FOUND);

    // Check if the token exists in the database and is not expired
    const verificationToken = await prisma?.email_verification_token.findUnique(
      {
        where: { token },
      }
    );

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Invalid or expired token" });
    }

    // Update the user's email verification status in the database
    await prismaClient.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete the verification tokens that the user owns form the database
    await prismaClient.email_verification_token.deleteMany({
      where: { userId: verificationToken.userId },
    });

    // Return a success message
    return res.status(200).json({ message: "Email verification successful" });
  }
}
class NotFound implements Strategy {
  async execute() {
    return "not found";
  }
}

export class AuthService {
  readonly LOGIN = "login";
  readonly SIGNUP = "signup";
  readonly VERIFY_EMAIL = "verify-email";

  private strategy: Strategy = new NotFound();

  constructor(strategyType: string) {
    this.setStrategy(strategyType);
  }

  setStrategy(strategyType: string) {
    switch (strategyType) {
      case this.LOGIN:
        this.strategy = new Login();
        break;
      case this.SIGNUP:
        this.strategy = new Signup();
        break;
      case this.VERIFY_EMAIL:
        this.strategy = new VerifyEmail();
        break;
      default:
        this.strategy = new NotFound();
    }
  }

  async executeStrategy(
    req: TypedRequest<UserSignUpCredentials>,
    res: Response
  ): Promise<any> {
    return await this.strategy.execute(req, res);
  }
}
