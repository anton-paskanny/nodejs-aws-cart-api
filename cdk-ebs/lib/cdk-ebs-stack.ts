import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

const DEFAULT_4XX = {
  type: apigateway.ResponseType.DEFAULT_4XX,
  responseHeaders: {
    'Access-Control-Allow-Origin': "'*'",
  },
};

export class CdkEbsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ebsEnvironmentUrl =
      'http://anton-paskanny-cart-api-v2-dev.eu-west-1.elasticbeanstalk.com';

    const api = new apigateway.RestApi(this, 'EbsProxyApiGateway', {
      restApiName: 'EbsProxyAPI',
      description: 'API Gateway Proxy for Elastic Beanstalk backend',
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      },
    });

    api.addGatewayResponse('GetPresignedUrlDefault4xx', DEFAULT_4XX);

    const ebsIntegration = new apigateway.HttpIntegration(
      `${ebsEnvironmentUrl}/{proxy}`,
      {
        proxy: true,
        httpMethod: 'ANY',
        options: {
          requestParameters: {
            'integration.request.path.proxy': 'method.request.path.proxy',
          },
        },
      },
    );

    const proxyResource = api.root.addResource('{proxy+}');
    proxyResource.addMethod('ANY', ebsIntegration, {
      requestParameters: {
        'method.request.path.proxy': true,
      },
    });

    new cdk.CfnOutput(this, 'EbsProxyApiUrl', {
      value: api.url,
    });
  }
}
