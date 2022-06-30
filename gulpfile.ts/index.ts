import { ConfigResolver } from "../src/util";
import { Argument } from "./internal/Argument";
import { cdkCommand, DEFAULT_REGION } from "./internal/Cdk";
import { parse } from "path";

const { src, series, dest, parallel } = require("gulp");
const glob = require("glob");
const gulpClean = require("gulp-clean");
const gulpTs = require("gulp-typescript");
const gulpZip = require("gulp-zip");

// Default directories
const FUNCTIONS_DIR = "lambdas";
const BUILD_DIR = "build";
const FUNCTIONS_OUTPUT_DIR = `${BUILD_DIR}/${FUNCTIONS_DIR}`;
const DIST_DIR = `${BUILD_DIR}/dist`;

// Lambda tasks
function buildLambdas() {
    const tsProject = gulpTs.createProject("tsconfig.json");
    return src(`${FUNCTIONS_DIR}/**/*.ts`)
        .pipe(tsProject()).js
        .pipe(dest(FUNCTIONS_OUTPUT_DIR))
}

function zipLambdas() {
    const functionDirs = glob.sync(`${FUNCTIONS_OUTPUT_DIR}/*`);
    const promises = functionDirs.map((functionDir: string) =>
        new Promise(resolve => {
            const functionName = parse(functionDir).base;
            resolve(
                src(`${functionDir}/*`)
                    .pipe(gulpZip(`${functionName}.zip`))
                    .pipe(dest(DIST_DIR))
            )
        })
    );

    return Promise.all(promises);
}

export const packageLambdas = series(buildLambdas, zipLambdas);

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

export const deploy = series(
    parallel(bootstrap, packageLambdas),
    () => {
        const stack = Argument.optionalString("stack", "*");
        return cdkCommand({
            command: "deploy",
            commandParams: `${stack}`,
            outputDir: `${BUILD_DIR}/cdk.out.deploy/`,
        });
    }
);

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
