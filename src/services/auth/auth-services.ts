import { db } from "@database/connection";
import { sso_users  } from "@database/schema";
import { eq, or} from "drizzle-orm";


export class AuthService {
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
        hasher.update(`erakaunting_${data.uuidv7.replace(/-/g, '')}`);
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