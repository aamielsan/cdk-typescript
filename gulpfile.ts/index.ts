import { ConfigResolver } from "../src/util";
import { Argument } from "./internal/Argument";
import { cdkCommand, DEFAULT_REGION } from "./internal/Cdk";

const { src, series, dest } = require("gulp");
const gulpClean = require("gulp-clean");
const gulpTs = require("gulp-typescript");

// Default directories
const FUNCTIONS_DIR = "lambdas";
const BUILD_DIR = "build";
const FUNCTIONS_OUTPUT_DIR = `${BUILD_DIR}/${FUNCTIONS_DIR}`;

// Lambda tasks
function buildLambdas() {
    const tsProject = gulpTs.createProject("tsconfig.json");
    return src(`${FUNCTIONS_DIR}/**/*.ts`)
        .pipe(tsProject()).js
        .pipe(dest(FUNCTIONS_OUTPUT_DIR))
}

// CDK tasks
export function bootstrap() {
    const env = Argument.requiredString("env");
    const accountId = ConfigResolver.getAccountIdByEnvironment(env)
    const region = Argument.optionalString("region", DEFAULT_REGION)

    return cdkCommand({
        command: "bootstrap",
        commandParams: `aws://${accountId}/${region}`,
        outputDir: `${BUILD_DIR}/cdk.out.bootstrap/`,
    });
}

export const synth = series(bootstrap, () => {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "synth",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.synth/`,
    });
});

export const diff = series(bootstrap, () => {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "diff",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.diff/`,
    });
});

export const deploy = series(bootstrap, () => {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "deploy",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.deploy/`,
    });
});

export const destroy = series(bootstrap, () => {
    const stack = Argument.optionalString("stack", "*");
    return cdkCommand({
        command: "destroy",
        commandParams: `${stack}`,
        outputDir: `${BUILD_DIR}/cdk.out.deploy/`,
    });
});

// Utility tasks
export function clean() {
    return src(`${BUILD_DIR}/`, { read: false })
        .pipe(gulpClean());
};
