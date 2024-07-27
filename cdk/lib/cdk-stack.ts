import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { CartApi } from '../api/api.gateway';
import { CartServiceLambda } from '../lambdas/cart-lambda';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbUsername = process.env.DB_USERNAME!;
    const dbPassword = process.env.DB_PASSWORD!;
    const dbHost = process.env.DB_HOST!;
    const dbPort = process.env.DB_PORT!;
    const dbName = process.env.DB_NAME!;

    const dbResourceId = process.env.DB_RESOURCE_ID!;
    const dbSecurityGroupId = process.env.DB_SECURITY_GROUP_ID!;

    const rdsSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'RdsSecurityGroup',
      dbSecurityGroupId,
    );

    const rdsInstance = rds.DatabaseInstance.fromDatabaseInstanceAttributes(
      this,
      'MyRDSInstance',
      {
        instanceIdentifier: dbName,
        instanceEndpointAddress: dbHost,
        instanceResourceId: dbResourceId,
        port: parseInt(dbPort!, 10),
        securityGroups: [rdsSecurityGroup],
      },
    );

    const environment = {
      DB_USERNAME: dbUsername,
      DB_PASSWORD: dbPassword,
      DB_HOST: dbHost,
      DB_PORT: dbPort,
      DB_NAME: dbName,
    };

    const cartLambdaFn = new CartServiceLambda(
      this,
      'CartServiceLambda',
      environment,
    );

    rdsInstance.grantConnect(cartLambdaFn.lambdaFunction, dbUsername);

    new CartApi(this, 'CartApi', {
      cartLambdaFn: cartLambdaFn.lambdaFunction,
    });
  }
}
