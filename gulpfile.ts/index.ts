import { ConfigResolver } from "../src/util";
import { Argument } from "./Argument";
import { cdkCommand, DEFAULT_REGION } from "./Cdk";

const { src, series } = require("gulp");
const gulpClean = require("gulp-clean");

const BUILD_DIR = "build"

// TASKS
export async function bootstrap() {
    const env = Argument.requiredString("env");
    const accountId = ConfigResolver.getAccountIdByEnvironment(env)
    const region = Argument.optionalString("region", DEFAULT_REGION)

    return cdkCommand({
        command: "bootstrap",
        commandParams: `aws://${accountId}/${region}`,
        outputDir: `${BUILD_DIR}/cdk.out.bootstrap/`,
    });
}

async function _synth() {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "synth",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.synth/`,
    });
}

export const synth = series(bootstrap, _synth);

async function _diff() {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "diff",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.diff/`,
    });
}

export const diff = series(bootstrap, _diff);

async function _deploy() {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "deploy",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.deploy/`,
    });
}

export const deploy = series(bootstrap, _deploy)

async function _destroy() {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "destroy",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.deploy/`,
    });
}

export const destroy = series(bootstrap, _destroy);

export function clean() {
    return src(`${BUILD_DIR}/`, { read: false })
        .pipe(gulpClean());
}
