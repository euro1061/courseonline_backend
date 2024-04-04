export type MessageBody = {
    chat_id: string,
    config: {
        wide_screen_mode: boolean
    },
    header: {
        title: {
            tag: string,
            content: string
        },
        template: string
    },
    elements: Array<{
        tag: string,
        content?: string,
        actions?: Array<{
            tag: string,
            text: {
                tag: string,
                content: string
            },
            type: string,
            value: {
                [key: string]: string
            }
        }>
    }>
}