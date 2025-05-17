import { z } from "zod";
import { Context } from 'hono';
import { randomUUIDv7 } from "bun";
import { handleError } from '@helpers/handleError';
import { AuthService } from '@services/auth/auth-services';
import RSACryptoHelper from '@helpers/cryptoString';

export async function loginSSO(c: Context){
    const schema = z.object({
        username: z.string(),
        password: z.string().min(6),
        fingerprint: z.string(),
        login_from: z.string(),
    })
    const body = await c.req.json();
    const data = schema.parse(body);
    try{
        const resultLogin = await AuthService.processLoginSSO({
            username: data.username,
            password: data.password,
            fingerprint: data.fingerprint,
            login_from: data.login_from,
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
        let response;
        if (typeof resultLogin !== "number" && resultLogin.token && resultLogin.uuid) {
            response = new Response(
                JSON.stringify({
                    success: is_success,
                    message: messages,
                    data: resultLogin,
                }),
                {
                    status: is_success ? 200 : 401,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }
        return response;
    }catch (e) {
        const error = e as Error;
        return handleError(c, error, `Something Error when users do Login with username ${data.username}. Please contact the administrator.`);
    }
}
export async function registerSSO(c: Context) {
    const schema = z.object({
        email: z.string().email(),
        phone: z.string().min(10),
        username: z.string().min(3),
        password: z.string().min(6),
        role: z.number().int().positive(),
        registration_number: z.string().min(5)
    });
    const body = await c.req.json();
    const data = schema.parse(body);   
    try {
        const bcryptHashPassword = await Bun.password.hash(data.password, {
            algorithm: "bcrypt",
            cost: process.env.BCRYPT_COST ? parseInt(process.env.BCRYPT_COST) : 12,
        });
        const resultRegister = await AuthService.processRegisterSSO({
            uuidv7: randomUUIDv7(),
            email: data.email,
            phone: data.phone,
            username: data.username,
            password: bcryptHashPassword,
            role: data.role,
            registration_number: data.registration_number,
            status: false,
            max_allowed_login: 5,
            created_at: new Date(),
        });
        let messages = `Registration successful for username : ${data.username}`, is_success = true, data_result = resultRegister;
        if ("success" in resultRegister && !resultRegister.success) {
            messages = `Registration failed because username or email or registration number already exists.`;
            is_success = false;
            data_result = resultRegister;
        }
        return c.json({
            success: is_success,
            message: messages,
            data: data_result,
        },is_success ? 201 : 400);
    } catch (e) {
        const error = e as Error;
        return handleError(c, error, `Something Error when users do Register username ${data.username}. Please contact the administrator.`);
    }
}