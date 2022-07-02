import { CliCredentialsStackSynthesizer, Stack, StackProps } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";
import { Naming } from "../util";

interface ApiStackProps {
    account: string;
    region: string;
    environment: string;
    label: string;
}

export class HelloWorldStack extends Stack {
    private naming: Naming;

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        const naming = new Naming({
            env: props.environment,
            baseName: "hello-world",
            label: props.label,
        });

        const stackProps: StackProps = {
            stackName: naming.prefixWithNamespaceModuleName("stack"),
            env: {
                account: props.account,
                region: props.region,
            },
            synthesizer: new CliCredentialsStackSynthesizer(),
        }

        super(scope, id, stackProps);

        this.naming = naming;

        // Resources part of the stack
        const fn = new Function(this, "HelloWorldFunction", {
            functionName: naming.prefixWithNamespaceModuleName("hello-world-v1"),
            handler: "index.handler",
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, "../..", "build/dist/hello-world.zip")),
        });
    }
}