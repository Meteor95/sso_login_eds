import { sign, verify } from 'hono/jwt'
import { JWTPayload } from 'hono/utils/jwt/types';

const SECRET_KEY = process.env.PRIVATE_KEY_JWT || 'secret';

export async function generateToken(payload: JWTPayload) {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60; // +1 hour
    return await sign({ ...payload, exp }, SECRET_KEY, "HS256");
}
export async function verifyToken(token: string) {
    try {
        const decoded = await verify(token, SECRET_KEY, "HS256");
        return decoded;
    } catch (error) {
        return null;
    }
}