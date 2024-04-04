import { Request, Response } from "express";
import axios from 'axios';
import { TypedRequestBody } from "../../resource/interfaces";
import { MessageBody } from "./larkTypes";
import { success } from "../../config/response";
import { getTenantAccessToken } from "../../functions";

class larkController {
    async onWebhook(req: Request, res: Response) {
        console.log(req.body)
        res.json(req.body)
    }

    async onSendMessage(req: TypedRequestBody<MessageBody>, res: Response) {
        try {
            const { body } = req;
            const tanantToken = await getTenantAccessToken();
            const resMessage = await axios({
                method: 'POST',
                url: 'https://open.larksuite.com/open-apis/message/v4/send/',
                headers: {
                    'Authorization': `Bearer ${tanantToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    "chat_id": body.chat_id,
                    "msg_type": "interactive",
                    "update_multi": false,
                    "card": {
                        "config": body.config,
                        "header": body.header,
                        "elements": body.elements
                    }
                }
            })
            success(res, resMessage.data)
        } catch (error) {
            console.error(error)
            res.json(error)
        }
    }
}

export default new larkController();