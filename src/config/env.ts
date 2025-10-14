import z from "zod";
import "dotenv/config";

const envSchema = z.object({
    PORT: z.coerce.number(),
    PARSE_URL: z.string(),
    PARSE_APP_ID: z.string(),
    PARSE_MASTER_KEY: z.string()
})

const _env = envSchema.safeParse(process.env)

if(!_env.success) {
    throw new Error("Invalid environment variables", _env.error)
}

export const env = _env.data