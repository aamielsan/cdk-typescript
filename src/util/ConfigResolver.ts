import { readFile } from "fs";
import { resolve } from "path";
import { promisify } from "util";
import { Env } from "../types";
import accounts from "../../configs/accounts.json";

const readFileAsync = promisify(readFile)

export class ConfigResolver {
    // Resolves the correct AWS account ID in `configs/accounts.json` based on environment
    public static getAccountIdByEnvironment(env: string): string {
        const accountId = accounts[env as Env] as string;

        if (!accountId) {
            throw `AWS account ID not found for environment: ${env}`;
        }

        return accountId;
    }

    // Resolves the correct `config-{env}.json` based on environment
    public static async getConfigsByEnvironment(env: string): Promise<{ [key:string]: string }> {
        const configFile = await readFileAsync(resolve(__dirname, "../../", "configs", `config-${env}.json`))
        const config = JSON.parse(configFile.toString())
        return config
    }
}