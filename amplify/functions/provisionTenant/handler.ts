import { Handler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

export const handler: Handler = async (event) => {
  console.log('Provisioning tenant:', JSON.stringify(event, null, 2));

  try {
    const { tenantId, name, contactEmail, billingPlan } = event;

    if (!tenantId || !name || !contactEmail || !billingPlan) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid input. tenantId, name, contactEmail, and billingPlan are required.',
        }),
      };
    }

    // Access the table name injected as an environment variable
    const tableName = process.env.TENANT_TABLE_NAME;
    if (!tableName) {
      throw new Error('TENANT_TABLE_NAME environment variable is not defined');
    }

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: {
        tenantId: { S: tenantId },
        name: { S: name },
        contactEmail: { S: contactEmail },
        billingPlan: { S: billingPlan },
        createdAt: { S: new Date().toISOString() },
      },
    });

    await dynamoDBClient.send(putItemCommand);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Tenant provisioned successfully',
        tenantId,
      }),
    };
  } catch (error) {
    console.error('Error provisioning tenant:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
