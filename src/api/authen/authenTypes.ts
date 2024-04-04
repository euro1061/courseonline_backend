export type RegisterBody = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    nickName: string;
    email: string;
}

export type VerifyBody = {
    verifyCode: string
}