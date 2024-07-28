import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface CartApiProps extends cdk.StackProps {
  cartLambdaFn: lambda.Function;
}

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

    const cartResource = api.root.addResource('cart');

    const cartLambdaIntegration = new apigateway.LambdaIntegration(
      props.cartLambdaFn,
      {
        proxy: true,
        allowTestInvoke: true,
      },
    );

    cartResource.addMethod('GET', cartLambdaIntegration);
    cartResource.addMethod('PUT', cartLambdaIntegration);
    cartResource.addMethod('DELETE', cartLambdaIntegration);

    const checkoutResource = cartResource.addResource('checkout');
    checkoutResource.addMethod('POST', cartLambdaIntegration);
  }
}
