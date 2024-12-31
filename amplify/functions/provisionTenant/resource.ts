import { defineFunction } from '@aws-amplify/backend';

export const provisionTenant = defineFunction({
  name: 'provisionTenant',
  entry: './handler.ts',
  runtime: 18,
  memoryMB: 512,
  timeoutSeconds: 120,
  environment: {
    TENANT_TABLE_NAME: '{resourceName}', // Use the table resource name set in Amplify CLI
  },
});
