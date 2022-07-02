#!/usr/bin/env node
import "source-map-support/register";
import { Context } from "../src/util";
import { HelloWorldStack } from "../src/stacks/HelloWorldStack";
import { App } from "aws-cdk-lib";

// Common
const app = new App();

// Stacks
new HelloWorldStack(app, "HelloWorldStack", {
    account: Context.requiredString(app, "Account"),
    environment: Context.requiredString(app, "Environment"),
    label: Context.requiredString(app, "Label"),
    region: Context.requiredString(app, "Region"),
})
