import { Request, Response } from "express";
import { TypedRequestBody } from "../../resource/interfaces";
import { RegisterBody, VerifyBody } from "./authenTypes";
import { PrismaClient } from "@prisma/client";
import {
  errorResponse,
  formEmail,
  generateUserId,
  generateVerifyCode,
  sendEmail,
  successResponse,
} from "../../functions";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../../env";

class authenController {
  async onRegister(req: TypedRequestBody<RegisterBody>, res: Response) {
    const prisma = new PrismaClient();

    const { username, password, firstName, lastName, nickName, email } = req.body;
    try {
      // check if user already exists
      const user = await prisma.cST_Users.findFirst({
        where: {
          OR: [
            {
              username: username,
            },
            {
              email: email,
            }
          ]
        },
      });
      console.log(user);
      if (user) return errorResponse(res, "user or email already exists", 400);

      // hash password
      const hashedPassword = await argon2.hash(password);

      const lastUser = await prisma.cST_Users.findFirst({
        orderBy: {
          userId: "desc",
        },
        select: {
          userId: true,
        },
        take: 1,
      });

      const userId = generateUserId(lastUser?.userId || "CSU-241000");
      const verifyCode = generateVerifyCode();

      // create user
      await prisma.cST_Users.create({
        data: {
          userId,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          nickName,
          email,
          verifyStatus: "waitConfirmEmail",
          verifyCode: verifyCode,
        },
      });

      const emailHtml = formEmail("EMAIL-VERIFY-ACCOUNT", {
        firstName,
        verifyCode,
      });

      const statusSendEmail = await sendEmail({
        to: email,
        html: emailHtml,
        subject: "[VERIFY] รหัสสำหรับการยืนยันการใช้งานเว็บไซต์ XYZABC.COM",
      });

      // console.log(statusSendEmail);

      return successResponse(res, [], "User created successfully");
    } catch (error) {
      errorResponse(res, error, 400);
    }
  }

  async onVerify(req: TypedRequestBody<VerifyBody>, res: Response) {
    const prisma = new PrismaClient();

    const { verifyCode } = req.body;

    try {
        const findAccByVerifyCode = await prisma.cST_Users.findFirst({
            where: {
                verifyCode: verifyCode,
                verifyStatus: "waitConfirmEmail"
            }
        })
        if(!findAccByVerifyCode) return errorResponse(res, "verify code invalid.", 400);
        
        findAccByVerifyCode.verifyStatus = "verifyComplete";
        findAccByVerifyCode.verifyCode = null;
        findAccByVerifyCode.verifiedAt = new Date();

        await prisma.cST_Users.update({
            where: {
                userId: findAccByVerifyCode.userId
            },
            data: findAccByVerifyCode
        })

        return successResponse(res, [], "Verify account successfully");
    } catch (error) {
        errorResponse(res, error, 400);
    }
  }

  async onLogin(req: Request, res: Response) {
    const prisma = new PrismaClient();

    const { username, password, rememberMe } = req.body;
    try {
      const user = await prisma.cST_Users.findFirst({
        // where username or email is equal to username and verifyStatus is equal to verifyComplete
        where: {
          OR: [
            {
              username: username,
            },
            {
              email: username,
            },
          ],
          verifyStatus: "verifyComplete",
        },
      });
      if(!user) return errorResponse(res, "user not found", 400);

      const isPasswordValid = await argon2.verify(user.password, password);

      if(!isPasswordValid) return errorResponse(res, "password invalid", 400);

      const token = jwt.sign({ userId: user.userId }, env.tokenSecret as string, {
        expiresIn: rememberMe ? "7d" : "5m",
      });
      const refreshToken = jwt.sign({ userId: user.userId }, env.refreshTokenSecret as string, {
        expiresIn: "7d",
      });

      return successResponse(res, { token, refreshToken }, "Login successfully");
    } catch (error) {
      errorResponse(res, error, 400); 
    }
  }
}

export default new authenController();
