/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./auth/dto/auth.dto"), { "AuthDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 6 } } }], [import("./auth/dto/refresh-token.dto"), { "RefreshTokenDto": { refreshToken: { required: true, type: () => String } } }]], "controllers": [[import("./auth/auth.controller"), { "AuthController": { "register": { description: "Register new user" }, "login": { description: "Login user" }, "getNewTokens": { description: "Update token" } } }]] } };
};