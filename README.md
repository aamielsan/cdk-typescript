# cdk-nodejs

## Prerequisite

1. Install AWS CLI v2 by following the steps [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2. Request access to the web team's AWS account via ServiceNow
3. Install `cdk` by running `npm install -g aws-cdk@1.108.1`
4. (Optional) Install `gulp` by running `npm install -g gulp`
5. Install dependencies by running `npm install`

## Using AWS CLI

### Installing AWS CLI v2

The AWS CLI is required for running deployment scripts locally. AWS CLI v2 needs to be installed, since AWS CLI v1 does not have support for AWS SSO.

- Install the specific AWS CLI **version 2.2.27** by referring to this AWS [documentation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html). Follow the installation steps based on your operating system

### Getting temporary credentials for AWS CLI

After you have a configured named profiles:
- Activate the privileged session group for AWS
- To get the temporary credentials, run: `aws sso login --profile profile-name`
- After successfully enabling the profile, you can now run AWS CLI commands. For example: `aws s3 ls --profile profile-name`

Note: You can get temporary credentials for different profiles
```
# Get and store temporary credentials for my-first-sso-profile
$ aws sso login --profile my-first-sso-profile

# Get and store another set of temporary credentials for my-second-sso-profile
# Does not overwrite / compromise the first profile's credentials
$ aws sso login --profile my-second-sso-profile
```

## CDK tasks

The project utilizes `gulp` to create and run tasks.
This enables us to do things before actually running the predefined CDK tasks, for example:

- resolving and using SSO credentials from running `aws sso login`;
- resolving configurations from config files in `configs/` and configurations passed in the command line, then converting the
configurations into runtime contexts that CDK supports;
- standardising the CDK toolkit name and parameters supported
by CDK tasks

Most of the CDK tasks should be supported and can be invoked by running:

```sh
gulp synth \                # cdk task; enum: synth, diff, deploy, destroy
    --env dev \             # environment to deploy to; enum: dev, sit, uat, prod
   [--stack '*'] \          # optional; pattern of stack id to deploy; default is '*' deploys all stack
   [--region eu-west-1] \   # optional; aws region; default is us-east-1
   [...--context Key=value] # optional; runtime configurations; overwrites configuration from config files; accessible in cdk through runtime contexts
```
