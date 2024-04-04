import { env } from "../env";
import axios from "axios";
import nodemailer from "nodemailer";

export const appendPrefix = (routeName: string) => {
  const prefix = env.prefix;
  const versionApi = env.versionApi;
  return `/${prefix}${versionApi}/${routeName}`;
};

export const getOsEnv = (key: string) => {
  if (typeof process.env[key] === "undefined") {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key];
};

export const getTenantAccessToken = async (): Promise<string> => {
  const larkAppId = env.larkAppId;
  const larkAppSecret = env.larkAppSecret;
  const res = await axios({
    method: "POST",
    url: `https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal/`,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      app_id: larkAppId,
      app_secret: larkAppSecret,
    },
  });
  return res.data.tenant_access_token;
};

export const successResponse = (
  res: any,
  data: any,
  message: string = "Success"
) => {
  return res.status(200).json({
    message,
    data,
  });
};

export const errorResponse = (
  res: any,
  message: any,
  status: number = 400
) => {
  return res.status(status).json({
    message,
  });
};

export const generateUserId = (lastUserId: string) => {
  const yy = new Date().getFullYear().toString().slice(-2);
  if (!lastUserId) return `CSU-${yy}1001`;
  const userIdSplit = lastUserId.split("-");
  const yyInNumber = userIdSplit[1].slice(0, 2);
  const numberId = parseInt(userIdSplit[1].slice(2, 6));

  if (yyInNumber === yy) {
    return `CSU-${yy}${numberId + 1}`;
  } else {
    return `CSU-${yy}1001`;
  }
};

export const generateVerifyCode = () => {
  // Generate a code with 10 digits mix of letters and numbers
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let retVal = "";
  for (let i = 0; i < length; i++) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
};

export const sendEmail = async (inObjSendMail: {
  to: string;
  cc?: string[];
  subject: string;
  html: string;
  attachments?: any[];
}) => {
  const transporter = nodemailer.createTransport({
    host: env.hostMail,
    port: parseInt(env.portMail as string),
    secure: true,
    auth: {
      user: env.mail,
      pass: env.passWordMail,
    },
    from: env.mail,
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.MAIL,
    fromname: "Job Online",
    to: inObjSendMail.to,
    subject: inObjSendMail.subject,
    html: inObjSendMail.html,
    attachments: inObjSendMail.attachments,
  };

  let info = await transporter.sendMail(mailOptions);
//   console.log("info", info);
  return !!info.response;
};

export const formEmail = (section: string, obj: any) => {
  switch (section) {
    case "EMAIL-VERIFY-ACCOUNT":
      return `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <h2>เรียน คุณ${obj.firstName},</h2>
        <p>ขอบคุณที่สมัครสมาชิกกับเรา ในการตรวจสอบและยืนยันบัญชีของคุณ โปรดใช้รหัสต่อไปนี้เพื่อทำการยืนยันบัญชี:</p>
        <p>รหัส Verify: <strong>${obj.verifyCode}</strong></p>
        <p>นำรหัสที่ได้รับมากรอกที่เว็บไซต์ <a href="www.gooogle.com" style="color: blue; text-decoration: none;">ยืนยันบัญชี</a> เมื่อ Verify บัญชีเรียบร้อยแล้วสามารถเริ่มใช้งานได้ทันที</p>
        <p>ขอบคุณมาก,</p>
        <p>MR. XYZ</p>
        <p>XYZABC.COM</p>
        <p>TEL: 064-856-8894</p>
      </div>
        `;

    default:
      console.error("OUT OF SECTION");
      return "OUT OF SECTION"
  }
};
