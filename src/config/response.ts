import { Response } from 'express'; // นำเข้า Response จาก Express

export const success = (
  res: Response,
  message: string,
  result: Record<string, any> = {},
  code: number = 200
): void => {
  res.status(code).json({ success: true, message, result });
};

export const failed = (
  req: any, // หรือใช้ type ของ req ที่ถูกต้องตามโปรเจ็กต์ของคุณ
  res: Response,
  msg: string | { message: string; [key: string]: any },
  error?: string | null,
  code?: number
): void => {
  console.error(error || msg, req.originalUrl);

  let obj: { success: boolean; message: string; result: Record<string, any> } = {
    success: false,
    message: '',
    result: {},
  };

  if (typeof msg === 'string') {
    obj = { ...obj, message: msg };
  } else {
    const { message, ...utils } = msg;
    obj = { ...obj, message, result: utils };
  }

  res.status(code || 400).json(obj);
};
