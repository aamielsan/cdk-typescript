import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"

const client = new DynamoDBClient({});

const tableArn = process.env["TABLE_ARN"];
const tableName = process.env["TABLE_NAME"];
const tableStreamArn = process.env["TABLE_STREAM_ARN"];

export async function handler() {
    console.log({
        tableArn,
        tableName,
        tableStreamArn,
    });

    try {
        const response = await client.send(new ScanCommand({
            TableName: tableName,
        }));
        console.log(`Database items: ${response.Items}`);
    } catch (err) {
        console.log(`Error:`, err);
    }
}