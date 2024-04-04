import { Router } from 'express';
import authenController from './authenController';
import { validateSchema } from '../../middlewares/validate-schema';
import { loginSchema, registerSchema, verifySchema } from './authenSchema';

const route = Router();
route.post(
    '/register',
    validateSchema([registerSchema]),
    authenController.onRegister
);

route.post(
    '/verify',
    validateSchema([verifySchema]),
    authenController.onVerify
)

route.post(
    '/login',
    validateSchema([loginSchema]),
    authenController.onLogin
)

module.exports = route;