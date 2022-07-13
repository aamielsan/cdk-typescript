import * as AWS from "aws-sdk";

const client = new AWS.DynamoDB()

const tableArn = process.env["TABLE_ARN"];
const tableName: string = process.env["TABLE_NAME"]!;
const tableStreamArn = process.env["TABLE_STREAM_ARN"];

export async function handler() {
    console.log({
        tableArn,
        tableName,
        tableStreamArn,
    });

    client.scan({
        TableName: tableName,
    }, (err, response) => {
        if (!err) {
            console.log(`Database items: ${response.Items}`);
        } else {
            console.log(`Error encountered: ${err}`);
        }
    });
}