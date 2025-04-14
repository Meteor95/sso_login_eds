import { z } from "zod";
import { Context } from 'hono';
import { handleError } from '@helpers/handleError';
import { AuthService } from '@services/auth/auth-services';
import RSACryptoHelper from '@helpers/cryptoString';

export const loginSSO = async (c: Context) => {
    const schema = z.object({
        username: z.string(),
        password: z.string().min(6),
        device_id: z.string().min(12),
        client_id: z.number(),
        redirect_uri: z.string().url(),
        state: z.string().optional(),
    });
    try{
        const body = await c.req.parseBody();
        const data = schema.parse(body);   
        // 1. Validate client_id
        const resultLogin = await AuthService.processLoginSSO({
            username: data.username,
            password: data.password,
            device_id: data.device_id,
            access_form: "login_via_sso",
            client_id: data.client_id,
            redirect_uri: data.redirect_uri,
            state: data.state,
         });
        let messages = `Login successful for username : ${data.username}`, is_success = true;
        if(resultLogin == 0) {
            messages = `Login failed because username or password is incorrect.`;
            is_success = false;
        }
        if(resultLogin == -1) {
            messages = `Login failed because maximum login attempts has reached. Please logout in other device.`;
            is_success = false;
        }
        if(resultLogin == -2) {
            messages = `Login failed because account is not active or banned. Please contact the administrator.`;
            is_success = false;
        }
        if (resultLogin == -3) {
            messages = `Login failed because account SSO Login is not verified. Please check your profile.`;
            is_success = false;
        }
        let RSACryptoHelperresultLogin = "Token Not Generate, Please Contact An Administrator"
        let uuid : string = "";
        if (typeof resultLogin !== "number" && resultLogin.token && resultLogin.uuid) {
            uuid = resultLogin.uuid;
            RSACryptoHelperresultLogin = await RSACryptoHelper.encryptToken(resultLogin.token);
        }
        const response = new Response(
            JSON.stringify({
                success: is_success,
                message: messages,
                data: typeof resultLogin === "number" ? {
                    uuid: uuid,
                    token: RSACryptoHelperresultLogin,
                } : {
                    authorization_code: resultLogin.authorization_code,
                    redirect_uri: resultLogin.redirect_uri,
                    state: resultLogin.state,
                    uuid: uuid,
                    token: RSACryptoHelperresultLogin,
                }
            }),
            {
                status: is_success ? 200 : 401,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response;
    }catch (e) {
        const error = e as AggregateError;
        return handleError(c, error, `Something error when users do Login. Please contact the administrator.`);
    }
};