import { Router } from 'express';
import larkController from './larkController';
import { validateSchema } from '../../middlewares/validate-schema';
import { sendMessageSchema } from './larkSchema';

const route = Router();

route.post(
    '/sendMessage',
    validateSchema([sendMessageSchema]),
    larkController.onSendMessage
);

route.post(
    '/webhook',
    larkController.onWebhook
);

module.exports = route;