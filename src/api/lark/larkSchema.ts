import joi from 'joi';

export const sendMessageSchema = joi.object({
    chat_id: joi.string().required(),
    config: joi.object({
        wide_screen_mode: joi.boolean().required()
    }).required(),
    header: joi.object({
        title: joi.object({
            tag: joi.string().required(),
            content: joi.string().required()
        }).required(),
        template: joi.string().required()
    }).required(),
    elements: joi.array().items(joi.object({
        tag: joi.string().required(),
        content: joi.string(),
        actions: joi.array().items(joi.object({
            tag: joi.string().required(),
            text: joi.object({
                tag: joi.string().required(),
                content: joi.string().required()
            }).required(),
            type: joi.string().required(),
            value: joi.object().optional()
        }))
    })).required()
});