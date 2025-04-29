import { z } from "zod";
import { Context } from 'hono';
import { randomUUIDv7 } from "bun";
import { handleError } from '@helpers/handleError';
import { AuthService } from '@services/auth/auth-services';
import RSACryptoHelper from '@helpers/cryptoString';

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
            cost: process.env.BCRYPT_COST ? parseInt(process.env.BCRYPT_COST) : 10,
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
        },is_success ? 200 : 400);
    } catch (e) {
        const error = e as Error;
        return handleError(c, error, `Something Error when users do Register username ${data.username}. Please contact the administrator.`);
    }
}