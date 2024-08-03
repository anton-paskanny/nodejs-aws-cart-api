import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface CartApiProps extends cdk.StackProps {
  cartLambdaFn: lambda.Function;
}

const DEFAULT_4XX = {
  type: apigateway.ResponseType.DEFAULT_4XX,
  responseHeaders: {
    'Access-Control-Allow-Origin': "'*'",
  },
};

export class CartApi extends Construct {
  constructor(scope: Construct, id: string, props: CartApiProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'cart-api', {
      restApiName: 'Cart Service',
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    api.addGatewayResponse('GetPresignedUrlDefault4xx', DEFAULT_4XX);

    const cartLambdaIntegration = new apigateway.LambdaIntegration(
      props.cartLambdaFn,
      {
        proxy: true,
        allowTestInvoke: true,
      },
    );

    const proxyResource = api.root.addResource('{proxy+}');
    proxyResource.addMethod('ANY', cartLambdaIntegration);
  }
}
