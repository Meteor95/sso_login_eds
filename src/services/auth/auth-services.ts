import { db } from "@database/connection";
import { sso_users, sso_sessions, sso_users_login  } from "@database/schema";
import { eq, or, and, isNull } from "drizzle-orm";
import { pick } from "@helpers/objectHelper"
import moment from 'moment';


export class AuthService {
    static async processLoginSSO(data: {
        username: string;
        password: string;
        fingerprint: string;
        login_from: string;
    }) {
        const result = await db.transaction(async (trx) => {
            const resultUser = await db.select()
            .from(sso_users)
            .where(
                and(
                    or(
                        eq(sso_users.username, data.username),
                        eq(sso_users.email, data.username)
                    ),
                isNull(sso_users.deleted_at)
                )
            );
            if (resultUser.length === 0) {
                return 0;
            }
            if (!resultUser[0].status){
                return -2;
            }
            const isMatch = await Bun.password.verify(data.password, resultUser[0].password);
            if (!isMatch) {
                return 0;
            }
            const client = await db.query.sso_sessions.findFirst({
                where: (c, { eq }) => eq(c.user_id, resultUser[0].id),
            });
            if (!client) {
                return -3;
            }
            await trx.insert(sso_users_login)
                .values({
                    user_id: resultUser[0].id,
                    deviced_id: data.fingerprint,
                    created_at: moment().toDate()
                });
            
            return pick(resultUser[0], ["uuid", "email", "username","status","registration_number","phone"]);
        });
        return result;
    }
    static async processRegisterSSO(data: { 
        uuidv7: string;
        email: string;
        phone: string;
        username: string;
        password: string;
        role: number;
        registration_number: string;
        status: boolean;
        max_allowed_login: number;
        created_at: Date;
    }) {
        const resultUser = await db.select()
            .from(sso_users)
            .where(
                or(
                    eq(sso_users.username, data.username),
                    eq(sso_users.email, data.email),
                    eq(sso_users.registration_number, data.registration_number)
                )
            )
            .limit(1);

        if (resultUser.length > 0) {
            return {
                success: false,
                username: resultUser[0].username,
                email: resultUser[0].email,
                registration_number: resultUser[0].registration_number,
            };
        }
        const hasher = new Bun.CryptoHasher("sha256");
        hasher.update(`eraya_digital_${data.uuidv7.replace(/-/g, '')}`);
        const result = await db.insert(sso_users)
            .values({
                uuid: data.uuidv7,
                email: data.email,
                phone: data.phone,
                username: data.username,
                password: data.password,
                role: data.role,
                registration_number: data.registration_number,
                status: data.status,
                max_allowed_login: data.max_allowed_login,
                token: hasher.digest("hex"),
                created_at: data.created_at
            })
            .returning({ 
                id: sso_users.id, 
                username: sso_users.username 
            });

        return result;
    }
}