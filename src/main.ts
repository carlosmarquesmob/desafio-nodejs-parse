import { env } from "./config/env";
import { initParse } from "./config/parse";
import app from "./server";

async function bootstrap() {
    await initParse({
        appId: env.PARSE_APP_ID,
        masterKey: env.PARSE_MASTER_KEY,
        serverURL: env.PARSE_URL
    })

    app.listen({ port: env.PORT })
        .then(() => {
            console.log(`HTTP server running in http://localhost:${env.PORT}`)
            console.log(`Docs in http://localhost:${env.PORT}/docs`)
        })
        .catch(console.error)
}

bootstrap().catch(console.error)