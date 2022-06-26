import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export function addOutput(scope: Construct, props: {
    key: string,
    value: string,
    description?: string,
    exportName?: string
}): void {
    new CfnOutput(scope, props.key, {
        value: props.value,
        description: props.description,
        exportName: props.exportName
    });
}