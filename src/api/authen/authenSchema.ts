import joi from 'joi';

export const registerSchema = joi.object({
  username: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  nickName: joi.string().optional(),
  email: joi.string().email().required(),
  password: joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')).required().messages({
    'string.min': 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
    'string.pattern.base': 'รหัสผ่านต้องประกอบด้วยตัวเลข ตัวอักษรพิมพ์เล็กและพิมพ์ใหญ่'
  })
});

export const verifySchema = joi.object({
  verifyCode: joi.string().required()
})

export const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  rememberMe: joi.boolean().optional()
})