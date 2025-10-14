import Parse from "parse/node";
import { env } from "./env";

interface InitParseProps {
    appId: string
    masterKey: string
    serverURL: string
}

export function initParse({ appId, masterKey, serverURL }: InitParseProps) {
    Parse.initialize(appId, "")
    Parse.CoreManager.set("MASTER_KEY", masterKey)
    Parse.serverURL = serverURL
    return Parse
}