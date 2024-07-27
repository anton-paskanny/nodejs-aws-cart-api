import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

import { Construct } from 'constructs';

export class CartServiceLambda extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, environment: any) {
    super(scope, id);

    this.lambdaFunction = new lambda.Function(this, 'MyCartLambdaFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '..', '..', 'dist')),
      handler: 'main.handler',
      environment,
    });
  }
}
