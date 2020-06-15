import lambdaify from 'aws-lambda-fastify';
export const handler = lambdaify(require('./index'));
