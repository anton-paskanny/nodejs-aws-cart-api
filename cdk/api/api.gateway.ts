import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class CartApi extends Construct {
  constructor(scope: Construct, id: string, props: any) {
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
    );

    cartResource.addMethod('GET', cartLambdaIntegration);
    cartResource.addMethod('PUT', cartLambdaIntegration);
    cartResource.addMethod('DELETE', cartLambdaIntegration);

    const checkoutResource = cartResource.addResource('checkout');
    checkoutResource.addMethod('POST', cartLambdaIntegration);
  }
}
