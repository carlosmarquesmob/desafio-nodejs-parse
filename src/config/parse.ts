import Parse from "parse/node";
import { env } from "./env";

interface InitParseProps {
    appId: string
    masterKey: string
    serverURL: string
}

export async function initParse({ appId, masterKey, serverURL }: InitParseProps) {
    Parse.initialize(appId, "")
    Parse.serverURL = serverURL
    Parse.masterKey = masterKey

    return Parse
}