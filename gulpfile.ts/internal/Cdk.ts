import { ConfigResolver } from "../../src/util";
import { Argument } from "./Argument";

const { fromSSO } = require("@aws-sdk/credential-provider-sso");
const execa = require("execa");

type StringMap = { [key: string]: string }

export const DEFAULT_REGION = "us-east-1"

export async function cdkCommand(params: {
    command: "bootstrap" | "deploy" | "destroy" | "diff" | "synth",
    outputDir: string,
    commandParams?: string
}) {
    const {
        command,
        outputDir,
        commandParams
    } = params;

    const env = Argument.requiredString("env");
    const label = Argument.optionalString("label");
    const region = Argument.optionalString("region", DEFAULT_REGION);
    const profile = Argument.optionalString("profile", env);
    const credentials = await fromSSO({ profile })();

    const defaultContext = {
        "Account": ConfigResolver.getAccountIdByEnvironment(env),
        "Environment": env,
        "Label": label,
        "Region": region,
    }
    const configContext = await ConfigResolver.getConfigsByEnvironment(env);
    const commandLineContext = Argument.optionalStringArray("context", []);
    const runtimeContext = resolveRuntimeContext({
        defaultContext,
        configContext,
        commandLineContext,
    });

    const toolkitStackName = `${env}-cdk-toolkit`;
    const runtimeContextArgs = Object.entries(runtimeContext)
        .map(([key, value]) =>
            `--context=${key}=${value}` // execa treats spaces as delimiter, that's why the 'context=key=value'
        );

    console.log(`\nRunning \`${command}\` with runtime context:`, runtimeContext, "\n");

    return execa(
        "cdk",
        [
            command,
            ...runtimeContextArgs,
            `-o ${outputDir}`,
            `--qualifier=${env}`,
            "--require-approval=never",
            `--toolkit-stack-name=${toolkitStackName}`,
            commandParams,
        ],
        {
            stdio: "inherit", // Pipe stdin, stdout, stderr to terminal,
            env: {
                AWS_ACCESS_KEY_ID: credentials.accessKeyId,
                AWS_SECRET_ACCESS_KEY: credentials.secretAccessKey,
                AWS_SESSION_TOKEN: credentials.sessionToken,
            }
        }
    );
}

function resolveRuntimeContext({
    defaultContext,
    configContext,
    commandLineContext
}: {
    defaultContext: StringMap,
    configContext: StringMap,
    commandLineContext: string[]
}): StringMap {
    const commandLineContextMap = commandLineContext.reduce((acc, keyValuePair) => {
        const [key, value] = keyValuePair.split("=")
        return {
            ...acc,
            [key]: value
        }
    }, {});

    return {
        ...defaultContext,
        ...configContext,
        ...commandLineContextMap
    };
}
