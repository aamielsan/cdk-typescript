import { CliCredentialsStackSynthesizer, Stack, StackProps } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

interface ApiStackProps {
    account: string;
    region: string;
    environment: string;
}

export class HelloWorldStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        const stackProps: StackProps = {
            env: {
                account: props.account,
                region: props.region,
            },
            synthesizer: new CliCredentialsStackSynthesizer(),
        }

        super(scope, id, stackProps);

        // Resources part of the stack
        const fn = new Function(this, "HelloWorldFunction", {
            handler: "index.handler",
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, "..", "build/dist/hello-world.zip")),
        });
    }
}