import '../configEnv';
import { getOsEnv } from './functions';

export const env = {
    appName: getOsEnv('APP_NAME'),
    mode: getOsEnv('MODE'),
    portDev: getOsEnv('PORT_DEV'),
    portProd: getOsEnv('PORT_PROD'),
    prefix: getOsEnv('PREFIX'),
    versionApi: getOsEnv('VERSION_API'),
    larkAppId: getOsEnv('LARK_APP_ID'),
    larkAppSecret: getOsEnv('LARK_APP_SECRET'),
    hostMail: getOsEnv('HOST_MAIL'),
    passWordMail: getOsEnv('PASSWORD_MAIL'),
    mail: getOsEnv('MAIL'),
    portMail: getOsEnv('PORT_MAIL'),
    tokenSecret: getOsEnv('JSONTOKEN_SECRET'),
    refreshTokenSecret: getOsEnv('JSON_REFRESH_TOKEN_SECRET'),
}