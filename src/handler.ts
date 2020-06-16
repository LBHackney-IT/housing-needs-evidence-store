import lambdaify from 'aws-lambda-fastify';
// eslint-disable-next-line
export const handler = lambdaify(require('./index'));
